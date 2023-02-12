import {developerResponse, devInfos} from './interfaces.developers'
import {iProjects, iReadProjects} from './interface.projects'
import { QueryResult } from 'pg'

export interface iProjDev extends developerResponse, iReadProjects {}
export type iProjDevResult = QueryResult<iProjDev>
export type idTech = number | undefined
export interface iTechs {
    id?: number
    name: string
}

export type iTechResult = QueryResult<iTechs>

export interface iProjTech {
    id?: number,
    addedIn: Date,
    technologyId?: number,
    projectId?: number 
}

export interface iTechsProjRead extends iTechs,iProjects {}
export type iTechsProjReadResult = QueryResult<iTechsProjRead>
export type iProjTechResult = QueryResult<iProjTech>