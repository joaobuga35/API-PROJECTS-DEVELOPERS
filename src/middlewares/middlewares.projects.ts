import { NextFunction, Request, Response } from "express";
import { QueryConfig } from "pg";
import {client} from '../database/config'
import {iProjects, projectResult, readResult} from '../interfaces/interface.projects'

export const ensureDevExists = async( req: Request, resp: Response, next: NextFunction) : Promise<Response | void> => {
    const body: iProjects = req.body

    const queryString: string = `
        SELECT
            *
        FROM 
            developers
        WHERE
            id = $1
    `
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [body.developerId]
    }

    const queryResult: projectResult = await client.query(queryConfig)

    if (!queryResult.rows[0]) {
        return resp.status(400).json({
            message: 'Developer not found.'
        })
    }
    return next()
}

export const ensureIdProjectExists = async( req: Request, resp: Response, next: NextFunction) : Promise<Response | void> => {
    const id: number = Number(req.params.id)

    const queryString: string = `
        SELECT
            p.id as "projectID",
            p."name" as "projectName",
            p."description" as "projectDescription",
            p."estimatedTime" as "projectEstimatedTime",
            p."repository" as "projectRepository",
            p."startDate" as "projectStartDate",
            p."endDate" as "projectEndDate",
            p."developerId" as "projectDeveloperID",
            t.id as "technologyID",
            t."name" as "technologyName"
        FROM
            projects_technologies pt  
        RIGHT JOIN
            projects p  ON pt."projectId" = p.id
        LEFT  JOIN 
            technologies t ON pt."technologyId" = t.id
        WHERE 
            p.id = $1
    `
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id]
    }

    const queryResult: readResult = await client.query(queryConfig)

    req.responseProjects = {
        objectReadProject: queryResult.rows[0]
    }
    
    if (!queryResult.rowCount) {
        return resp.status(404).json({
            message: 'Projoect not found.'
        })
    }
    return next()
}