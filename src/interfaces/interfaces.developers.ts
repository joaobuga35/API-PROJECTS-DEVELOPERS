import { QueryResult } from "pg"

export interface iDeveloper  {
    name: string,
    email: string,
    developerInfoId?: number
}

export interface iDeveloperInfos {
    developerSince: string | null,
    preferredOS: string | null
}

export interface devInfos extends iDeveloperInfos {
    id: number
}

export interface developerResponse extends iDeveloper {
    id: number,
    developerSince: string | null,
    preferredOS: string | null
}

export type developerResult = QueryResult<developerResponse>
export type developerInfoResult = QueryResult<devInfos>