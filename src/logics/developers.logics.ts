import { Request, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "../database/config";
import {
  developerInfoResult,
  developerResponse,
  developerResult,
  devInfos,
  iDeveloper,
  iDeveloperEdit,
  iDeveloperInfos,
} from "../interfaces/interfaces.developers";
import { iProjDev, iProjDevResult } from "../interfaces/interface.projAndDev";

export const createDeveloper = async (
  req: Request,
  resp: Response
): Promise<Response> => {
  try {
    const developerData: iDeveloper = req.body;

    if (!req.body.name) {
      return resp.status(400).json({
        message: "Missing required keys: name",
      });
    }

    if (!req.body.email) {
      return resp.status(400).json({
        message: "Missing required keys: email",
      });
    }

    let newDeveloperData: iDeveloper = {
      name: developerData.name,
      email: developerData.email,
    };
    const queryString: string = format(
      `
                INSERT INTO 
                    developers (%I)
                VALUES 
                    (%L)
                RETURNING*;
            `,
      Object.keys(newDeveloperData),
      Object.values(newDeveloperData)
    );

    const queryResult: developerResult = await client.query(queryString);
    return resp.status(201).json(queryResult.rows[0]);
  } catch (error: any) {
    return resp.status(500).json({
      message: "Internal server error",
    });
  }
};

export const readAllDevelopers = async (
  req: Request,
  resp: Response
): Promise<Response> => {
  const queryString: string = `
        SELECT
        de.id as "developerID",
        de."name" as "name",
        de."email" as "email",
        de."developerInfoId" as "developerInfoId",
        dein."developerSince" as "developerInfoDeveloperSince",
        dein. "preferredOS" as "developerInfoPreferredOS"
        FROM
            developers de
        FULL JOIN
            developer_infos dein ON de."developerInfoId" = dein.id;
    `;
  const queryResult: developerResult = await client.query(queryString);
  return resp.status(200).json(queryResult.rows);
};

export const readDeveloperWithId = async (
  req: Request,
  resp: Response
): Promise<Response> => {
  const responseObjectDev = req.responseWithId.objectResponse;
  return resp.status(200).json(responseObjectDev);
};

export const updateDeveloper = async (
  req: Request,
  resp: Response
): Promise<Response> => {
  try {
    const id: number = Number(req.params.id);

    let newDeveloperData: iDeveloperEdit = {
      name: req.body.name,
      email: req.body.email,
    };

    if (!req.body.name && !req.body.email) {
      return resp.status(400).json({
        message: "At least one of those keys must be send",
        keys: "[name,email]",
      });
    }

    if (req.body.name && !req.body.email) {
      newDeveloperData = {
        name: req.body.name,
      };
    }

    if (!req.body.name && req.body.email) {
      newDeveloperData = {
        email: req.body.email,
      };
    }

    const queryString: string = format(
      `
            UPDATE
                developers
            SET(%I) = ROW(%L)
            WHERE
                id = $1
            RETURNING *;
        `,
      Object.keys(newDeveloperData),
      Object.values(newDeveloperData)
    );

    const queryConfig: QueryConfig = {
      text: queryString,
      values: [id],
    };

    const queryResult: developerResult = await client.query(queryConfig);
    return resp.status(200).json(queryResult.rows[0]);
  } catch (error: any) {
    return resp.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteDevloper = async (
  req: Request,
  resp: Response
): Promise<Response> => {
  const id: Number = Number(req.params.id);

  const queryString: string = `
        DELETE FROM developers WHERE id = $1;
    `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  await client.query(queryConfig);

  return resp.status(204).json();
};
