import { Request,Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "../database/config";
import {developerInfoResult, developerResponse, developerResult, devInfos, iDeveloper, iDeveloperInfos, iDeveloperInfosEdit} from '../interfaces/interfaces.developers'

export const createDeveloperExtraInformation = async (req: Request, resp: Response): Promise<Response> => {
    try {
        const idDev:number = Number(req.params.id)
        const devInfosBody: iDeveloperInfos = req.body

        if (!req.body.developerSince || !req.body.preferredOS) {
            return resp.status(400).json({message: 'Missing required keys: developerSince,preferredOS.'})
        }

        if (req.body.preferredOS !== 'Windows' && req.body.preferredOS !== 'Linux' && req.body.preferredOS !== 'MacOs') {
            return resp.status(400).json({
                message: 'Your preferredOS not accepted, only Windows,Linux or MacOs'
            })
        }

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
        return resp.status(500).json({
            message:"Internal server error."
        })
    }
}

export const updateDeveloperInfo = async (req: Request, resp: Response): Promise<Response> => {
    try {
        const id: number = Number(req.params.id)

        let newDeveloperInfoData:iDeveloperInfosEdit = {
            developerSince: req.body.developerSince,
            preferredOS: req.body.preferredOS
        }

        if (!req.body.developerSince && !req.body.preferredOS) {
            return resp.status(400).json({
                message:'At least one of those keys must be send',
                'keys': '[developerSince,preferredOS]'
            })
        }

        if (req.body.developerSince && !req.body.preferredOS) {
            newDeveloperInfoData = {
                developerSince: req.body.developerSince
            }
        }

        if (!req.body.developerSince && req.body.preferredOS) {
            newDeveloperInfoData = {
                preferredOS: req.body.preferredOS
            }
        }

        const queryString: string =format(`
                UPDATE
                    developer_infos
                SET(%I) = ROW(%L)
                WHERE
                    $1
                RETURNING *;
        `, Object.keys(newDeveloperInfoData),Object.values(newDeveloperInfoData)) 

        const queryConfig: QueryConfig = {
            text: queryString,
            values: [id]
        }

        const queryResult: developerResult = await client.query(queryConfig)
        return resp.status(200).json(queryResult.rows[0])
        
    } catch (error: any) {
        return resp.status(500).json({
            message: 'Internal server error'
        })
    }
}