import { NextFunction, Request, Response } from "express";
import { QueryConfig } from "pg";
import {client} from '../database/config' 
import {iProjDev, iProjDevResult, iTechResult, iTechs} from '../interfaces/interface.projAndDev'

export const verifyTechNameExists = async ( req: Request, resp: Response, next: NextFunction) : Promise<Response | void> => {
    const techBody: iTechs = req.body

    if (!techBody.name) {
        return resp.status(400).json({
            message: 'Missing a required key: name.'
        })
    }

    const queryString: string = `
        SELECT 
            *
        FROM
            technologies
        WHERE   
            technologies.name = $1;
    `
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [techBody.name]
    }

    const queryResult: iTechResult = await client.query(queryConfig)

    if (queryResult.rowCount > 0) {
        const firstRow = queryResult.rows[0];
        if (firstRow.id !== undefined || firstRow.id !== null) {
            req.localStorageId = {
                techId: Number(firstRow.id)
            }
        }
    } else {
        return resp.status(400).json({
            'message': 'Technology not supported.',
            'options': [
                'JavaScript',
                'Python',
                'React',
                'Express.js',
                'HTML',
                'CSS',
                'Django',
                'PostgreSQL',
                'MongoDB'
            ]
        })
    }
    return next()
}

export const verifyTechId = async ( req: Request, resp: Response, next: NextFunction) : Promise<Response | void> => {
    const queryString: string = `
        SELECT 
            *
        FROM
            technologies
        WHERE   
            technologies.name = $1;
    `
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [req.params.name]
    }

    const queryResult: iTechResult = await client.query(queryConfig)

    req.idTechFromDelete = {
        deleteIdTech: Number(queryResult.rows[0].id)
    }
    return next()
}

export const verifyTechNameForDelete = async ( req: Request, resp: Response, next: NextFunction) : Promise<Response | void> => {

    const queryString: string = `
        SELECT 
            *
        FROM
            technologies
        WHERE   
            technologies.name = $1;
    `
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [req.params.name]
    }

    const queryResult: iTechResult = await client.query(queryConfig)
    if (queryResult.rowCount === 0) {
        return resp.status(400).json({
            'message': 'Technology not supported.',
            'options': [
                'JavaScript',
                'Python',
                'React',
                'Express.js',
                'HTML',
                'CSS',
                'Django',
                'PostgreSQL',
                'MongoDB'
            ]
        })
    }
    return next()
}


