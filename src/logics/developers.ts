import { Request,Response } from "express";

export const createDeveloper = async (req: Request, resp: Response): Promise<Response> => {
    return resp.status(201).json()
}

export const readAllDevelopers = async (req: Request, resp: Response): Promise<Response> => {
    return resp.status(200).json()
}

export const readDeveloperWithId = async (req: Request, resp: Response): Promise<Response> => {
    return resp.status(200).json()
}

export const createDeveloperExtraInformation = async (req: Request, resp: Response): Promise<Response> => {
    return resp.status(201).json()
}