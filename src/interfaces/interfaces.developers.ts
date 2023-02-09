import { QueryResult } from "pg"

export interface iDeveloper  {
    name: string,
    email: string,
    developerInfoId?: number
}

export interface developerResponse extends iDeveloper {
    id: number
}

export type developerResult = QueryResult<developerResponse>