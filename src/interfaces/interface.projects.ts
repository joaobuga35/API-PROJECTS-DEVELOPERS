import { QueryResult } from "pg"

export interface iProjects {
    [key: string]: string | number | Date | null | undefined,
    name: string,
    description: string,
    estimatedTime: string,
    repository: string,
    startDate: Date,
    endDate?: Date | undefined,
    developerId?: number | undefined
}

export interface iProjectResponse extends iProjects {
    id: number
}


export interface iReadProjects extends iProjectResponse {
    technologyID: number | null,
    technologyName: string | null
}

export type readResult = QueryResult<iReadProjects>

export type projectResult = QueryResult<iProjectResponse>

export type projectKeys = string
