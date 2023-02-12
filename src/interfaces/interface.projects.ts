import { QueryResult } from "pg"

export interface iProjects {
    name: string,
    description: string,
    estimatedTime: string,
    repository: string,
    startDate: string,
    endDate?: string | null,
    developerId: number
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
