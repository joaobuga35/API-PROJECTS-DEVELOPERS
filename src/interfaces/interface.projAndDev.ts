import {developerResponse, devInfos} from './interfaces.developers'
import {iReadProjects} from './interface.projects'
import { QueryResult } from 'pg'

export interface iProjDev extends developerResponse, iReadProjects {}
export type iProjDevResult = QueryResult<iProjDev>