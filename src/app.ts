import express, { Application, json } from 'express'
import { startDatabase } from "./database/connection";
import {createDeveloper, createDeveloperExtraInformation, readAllDevelopers, readDeveloperWithId} from './logics/developers'

const app: Application = express()
app.use(express.json())

app.post('/developers', createDeveloper)
app.get('/developers', readAllDevelopers)
app.get('/developers/:id', readDeveloperWithId)
app.post('/developers/:id/infos', createDeveloperExtraInformation)

app.listen('3000', async () => {
    console.log('Server is running')
    await startDatabase()
})