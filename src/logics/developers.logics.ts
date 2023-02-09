import { Request,Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "../database/config";
import {developerResponse, developerResult, iDeveloper} from '../interfaces/interfaces.developers'

export const createDeveloper = async (req: Request, resp: Response): Promise<Response> => {
    try {
        const developerData: iDeveloper = req.body
        const {name, email}: iDeveloper = req.body

        if (!name || !email) {
            return resp.status(400).json({
                message: "Missing required keys: name and email"
            })
        }
        const queryString: string = format(
            `
                INSERT INTO 
                    developers (%I)
                VALUES 
                    (%L)
                RETURNING*;
            `,
            Object.keys(developerData),Object.values(developerData)
        )

        const queryResult: developerResult = await client.query(queryString)
        return resp.status(201).json(queryResult.rows[0])
        
    } catch (error: any) {
        return resp.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

export const readAllDevelopers = async (req: Request, resp: Response): Promise<Response> => {

    const queryString = `
        SELECT
            de.id as "developerID",
            de."name" as "name",
            de."email" as "email",
            de."developerInfoId" as "developerInfoId",
            dein.*
        FROM
            developers de
        FULL JOIN
            developer_infos dein ON de."developerInfoId" = dein.id;
    `
    const queryResult: developerResult = await client.query(queryString)
    return resp.status(200).json(queryResult.rows)
}

export const readDeveloperWithId = async (req: Request, resp: Response): Promise<Response> => {
    return resp.status(200).json()
}

export const createDeveloperExtraInformation = async (req: Request, resp: Response): Promise<Response> => {
    return resp.status(201).json()
}