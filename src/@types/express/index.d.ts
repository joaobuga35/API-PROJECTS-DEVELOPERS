import * as express from "express"
import { developerResponse } from "../../interfaces/interfaces.developers"

declare global {
    namespace Express {
        interface Request {
            responseWithId: {
                objectResponse: developerResponse
            }
        }
    }
}