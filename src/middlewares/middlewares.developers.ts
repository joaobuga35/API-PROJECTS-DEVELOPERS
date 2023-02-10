import { NextFunction, Request, Response } from "express";
import { QueryConfig } from "pg";
import {client} from '../database/config'
import { developerResult, iDeveloper } from "../interfaces/interfaces.developers";

export const ensureEmailExists = async( req: Request, resp: Response, next: NextFunction) : Promise<Response | void> => {

    const body: iDeveloper = req.body

    const queryString: string = `
        SELECT
            *
        FROM 
            developers
        WHERE
            email = $1
    `
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [body.email]
    }

    const queryResult: developerResult = await client.query(queryConfig)

    if (queryResult.rows[0]) {
        return resp.status(409).json({
            message: 'Email already exists.'
        })
    }
    return next()
}

export const ensureIdExists = async( req: Request, resp: Response, next: NextFunction) : Promise<Response | void> => {
    const id: number = Number(req.params.id)

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
        values: [id]
    }

    const queryResult: developerResult = await client.query(queryConfig)
    
    if (!queryResult.rowCount) {
        return resp.status(404).json({
            message: 'Developer not found.'
        })
    }
    return next()
}