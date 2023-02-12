import * as express from "express"
import { iReadProjects } from "../../interfaces/interface.projects"
import { developerResponse } from "../../interfaces/interfaces.developers"

declare global {
    namespace Express {
        interface Request {
            responseWithId: {
                objectResponse: developerResponse
            }
            responseProjects: {
                objectReadProject: iReadProjects
            }
        }
    }
}