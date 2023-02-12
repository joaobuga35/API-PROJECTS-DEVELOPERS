import { request, Request,response,Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "../database/config";
import {  iProjectResponse, iProjects, projectKeys, projectResult, readResult } from "../interfaces/interface.projects";

export const createProject = async (req: Request, resp: Response): Promise<Response> => {
    try {
        const projectsData: iProjects = req.body

        const projectsKeys: Array<string> = Object.keys(projectsData)
        const realKeys: projectKeys[] = ['name', 'description', 'estimatedTime', 'repository', 'startDate', 'developerId']
        const verifyKeys: boolean = realKeys.every((elem: string) => projectsKeys.includes(elem))

        if (!verifyKeys) {
            return resp.status(400).json({
                message:'Missing required keys: name, description, estimatedTime, repository, startDate, developerId'
            })
        }

        const newProjectsData: iProjects = {
            name: projectsData.name,
            description: projectsData.description,
            estimatedTime: projectsData.estimatedTime,
            repository: projectsData.repository,
            startDate: projectsData.startDate,
            developerId: projectsData.developerId
        }

        const queryString: string = format(
            `
                INSERT INTO 
                    projects (%I)
                VALUES 
                    (%L)
                RETURNING*;
            `,Object.keys(newProjectsData),Object.values(newProjectsData)
        )
        const queryResult: projectResult = await client.query(queryString)
        return resp.status(201).json(queryResult.rows[0])
    } catch (error:any) {
        return resp.status(500).json({
            message: 'Internal server error'
        })
    }
}

export const readAllProjects = async (req: Request, resp: Response): Promise<Response> => {
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
            projects p  
        LEFT JOIN
             projects_technologies pt ON pt."projectId" = p.id
        LEFT  JOIN 
        	technologies t ON pt."technologyId" = t.id;
    `

    const queryResult: readResult = await client.query(queryString)
    return resp.status(200).json(queryResult.rows)
}

export const readOneProjectWithId = async (req: Request, resp: Response): Promise<Response> => {
    const objectReturn = req.responseProjects.objectReadProject
    return resp.status(200).json(objectReturn)
}

export const editProject = async (req: Request, resp: Response): Promise<Response> => {
    try {
        const id: number = Number(req.params.id)
        const projectBody: iProjects = req.body

        const newProjectBody: iProjects = {
            name: projectBody.name,
            description: projectBody.description,
            estimatedTime: projectBody.estimatedTime,
            repository: projectBody.repository,
            startDate: projectBody.startDate,
            endDate: projectBody.endDate,
            developerId: projectBody.developerId
        }

        for(var key in newProjectBody) {
            if (newProjectBody[key as keyof iProjects] === null || newProjectBody[key as keyof iProjects] === undefined) {
                delete newProjectBody[key as keyof iProjects]
            }
        }

        if (Object.keys(newProjectBody).length === 0) {
            return resp.status(400).json({
                'message': 'At least one of those keys must be send.',
                'keys': [
                    'name',
                    'description',
                    'estimatedTime',
                    'repository',
                    'startDate',
                    'endDate',
                    'developerId'
                ]
            })
        }
        const queryString: string =format(
            `
                UPDATE
                    projects
                SET(%I) = ROW(%L)
                WHERE id = $1
                RETURNING*;
             `,Object.keys(newProjectBody),Object.values(newProjectBody)
        ) 

        const queryConfig: QueryConfig = {
            text: queryString,
            values:[id]
        }
        const queryResult: projectResult = await client.query(queryConfig)
        return resp.status(200).json(queryResult.rows[0])
    } catch (error: any) {
        return resp.status(500).json({
            message: 'Internal server error'
        })
    }
}

export const deleteProject = async (req: Request, resp: Response): Promise<Response> => {
    const id:number = Number(req.params.id)
    const queryString: string = `
        DELETE FROM projects WHERE id = $1;
    `
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id]
    }

    await client.query(queryConfig)
    return resp.status(204).json()
}