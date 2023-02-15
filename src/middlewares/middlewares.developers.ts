import { NextFunction, Request, Response } from "express";
import { QueryConfig } from "pg";
import { client } from "../database/config";
import {
  developerResult,
  iDeveloper,
} from "../interfaces/interfaces.developers";

export const ensureEmailExists = async (
  req: Request,
  resp: Response,
  next: NextFunction
): Promise<Response | void> => {
  const body: iDeveloper = req.body;

  const queryString: string = `
        SELECT
            *
        FROM 
            developers
        WHERE
            email = $1;
    `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [body.email],
  };

  const queryResult: developerResult = await client.query(queryConfig);

  if (queryResult.rows[0]) {
    return resp.status(409).json({
      message: "Email already exists.",
    });
  }
  return next();
};

export const ensureIdExists = async (
  req: Request,
  resp: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = Number(req.params.id);

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
            developer_infos dein ON de."developerInfoId" = dein.id
        WHERE 
            de.id = $1;
    `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: developerResult = await client.query(queryConfig);

  req.responseWithId = {
    objectResponse: queryResult.rows[0],
  };

  if (!queryResult.rowCount) {
    return resp.status(404).json({
      message: "Developer not found.",
    });
  }
  return next();
};

export const verifyDevInfoId = async (
  req: Request,
  resp: Response,
  next: NextFunction
): Promise<Response | void> => {
  const responseObjectDev = req.responseWithId.objectResponse;

  if (responseObjectDev.developerInfoId !== null) {
    const queryString: string = `
            DELETE FROM developer_infos WHERE id = $1;
        `;
    const queryConfig: QueryConfig = {
      text: queryString,
      values: [responseObjectDev.developerInfoId],
    };

    await client.query(queryConfig);

    return resp.status(204).json();
  }
  return next();
};
