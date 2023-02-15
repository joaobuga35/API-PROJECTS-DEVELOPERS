import { Request, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "../database/config";
import {
  iProjDev,
  iProjDevResult,
  iProjTech,
  iProjTechResult,
  iTechs,
  iTechsProjReadResult,
} from "../interfaces/interface.projAndDev";

export const readDeveloperProjects = async (
  req: Request,
  resp: Response
): Promise<Response> => {
  const id: number = Number(req.params.id);
  const queryString: string = `
        SELECT
            de.id as "developerID",
            de."name" as "name",
            de."email" as "email",
            de."developerInfoId" as "developerInfoId",
            dein."developerSince" as "developerInfoDeveloperSince",
            dein. "preferredOS" as "developerInfoPreferredOS",
            p.id as "projectID",
            p."name" as "projectName",
            p."description" as "projectDescription",
            p."estimatedTime" as "projectEstimatedTime",
            p."repository" as "projectRepository",
            p."startDate" as "projectStartDate",
            p."endDate" as "projectEndDate",
            t.id as "technologyID",
            t."name" as "technologyName"
        FROM
            developers de 
        LEFT JOIN
            developer_infos dein ON dein.id = de."developerInfoId"
        LEFT  JOIN 
            projects p  ON p."developerId" = de.id
        LEFT JOIN 
            projects_technologies pt ON pt."projectId" = p.id 
        LEFT JOIN 
            technologies t ON pt."technologyId" = t.id
        WHERE de.id = $1;
    `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  const queryResult: iProjDevResult = await client.query(queryConfig);
  return resp.status(200).json(queryResult.rows);
};

export const createTech = async (
  req: Request,
  resp: Response
): Promise<Response> => {
  const idProj: number = Number(req.params.id);
  const idAboutTechs: number = Number(req.localStorageId.techId);
  const currentDate: Date = new Date();

  const queryString: string = `
        INSERT INTO 
            projects_technologies ("addedIn", "technologyId", "projectId")
        VALUES 
            ($1, $2, $3)
        RETURNING *;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [currentDate, idAboutTechs, idProj],
  };
  await client.query(queryConfig);

  const queryTemplate: string = `
        SELECT
            t.id as "technologyID",
            t."name" as "technologyName",
            p.id as "projectID",
            p."name" as "projectName",
            p."description" as "projectDescription",
            p."estimatedTime" as "projectEstimatedTime",
            p."repository" as "projectRepository",
            p."startDate" as "projectStartDate",
            p."endDate" as "projectEndDate"
        FROM
            technologies t 
        LEFT JOIN 
            projects_technologies pt ON pt."technologyId" = t.id
        LEFT JOIN 
            projects p  ON pt."projectId" = p.id
        WHERE p.id = $1;
    `;
  const newQueryConfig: QueryConfig = {
    text: queryTemplate,
    values: [idProj],
  };

  const queryResult: iTechsProjReadResult = await client.query(newQueryConfig);
  return resp.status(201).json(queryResult.rows[0]);
};

export const deleteTechOnProject = async (
  req: Request,
  resp: Response
): Promise<Response> => {
  const idProj: number = Number(req.params.id);
  const idTechs: number = Number(req.idTechFromDelete.deleteIdTech);

  const queryString: string = `
        DELETE FROM
            projects_technologies pt 
        WHERE
            pt."technologyId" = $1 AND pt."projectId" = $2
        RETURNING *;   
    `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [idTechs, idProj],
  };

  await client.query(queryConfig);
  return resp.status(204).json();
};
