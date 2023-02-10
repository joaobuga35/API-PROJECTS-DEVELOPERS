import { Request,Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "../database/config";
import {developerInfoResult, developerResponse, developerResult, devInfos, iDeveloper, iDeveloperInfos} from '../interfaces/interfaces.developers'

export const createDeveloper = async (req: Request, resp: Response): Promise<Response> => {
    try {
        const developerData: iDeveloper = req.body
        let newDeveloperData = {
            name: developerData.name,
            email: developerData.email
        }
        const queryString: string = format(
            `
                INSERT INTO 
                    developers (%I)
                VALUES 
                    (%L)
                RETURNING*;
            `,
            Object.keys(newDeveloperData),Object.values(newDeveloperData)
        )

        const queryResult: developerResult = await client.query(queryString)
        return resp.status(201).json(queryResult.rows[0])
        
    } catch (error: any) {
        return resp.status(400).json({
            message: 'Missing required keys: name and email'
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
        dein."developerSince" as "developerInfoDeveloperSince",
        dein. "preferredOS" as "developerInfoPreferredOS"
        FROM
            developers de
        FULL JOIN
            developer_infos dein ON de."developerInfoId" = dein.id;
    `
    const queryResult: developerResult = await client.query(queryString)
    return resp.status(200).json(queryResult.rows)
}

export const readDeveloperWithId = async (req: Request, resp: Response): Promise<Response> => {
    const id:number = Number(req.params.id)

    const queryString = `
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
            de.id = $1
    `
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id]
    }
    const queryResult: developerResult = await client.query(queryConfig)
    return resp.status(200).json(queryResult.rows[0])
}

export const createDeveloperExtraInformation = async (req: Request, resp: Response): Promise<Response> => {
    try {
        const idDev:number = Number(req.params.id)
        const devInfosBody: iDeveloperInfos = req.body

        const newDevInfosBody:iDeveloperInfos = {
            developerSince: devInfosBody.developerSince,
            preferredOS: devInfosBody.preferredOS
        }

        let queryString: string = format(
            `
                INSERT INTO 
                    developer_infos (%I)
                VALUES 
                    (%L)
                RETURNING*;
            `,
            Object.keys(newDevInfosBody),Object.values(newDevInfosBody)
        )

        let queryResult: developerInfoResult = await client.query(queryString)
        
        queryString = `
            UPDATE
                developers
            SET
                "developerInfoId" = $1
            WHERE
                id = $2
            RETURNING *;
        `
        const queryConfig: QueryConfig = {
            text: queryString,
            values:[queryResult.rows[0].id,idDev]
        }

        await client.query(queryConfig)

        return resp.status(201).json(queryResult.rows[0])
    } catch (error: any) {
        return resp.status(400).json({
            message:"Missing required keys: developerSince,preferredOS."
        })
    }
}