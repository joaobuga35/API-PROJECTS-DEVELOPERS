import * as express from "express"
import { idTech } from "../../interfaces/interface.projAndDev"
import { iReadProjects } from "../../interfaces/interface.projects"
import { developerResponse } from "../../interfaces/interfaces.developers"

declare global {
    namespace Express {
        interface Request {
            responseWithId: {
                objectResponse: developerResponse
            },
            responseProjects: {
                objectReadProject: Array<iReadProjects>
            },
            localStorageId: {
                techId: idTech
            },
            idTechFromDelete: {
                deleteIdTech: number
            }
        }
    }
}
