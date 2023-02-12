import express, { Application, json } from 'express'
import { startDatabase } from "./database/connection";
import {createDeveloper, deleteDevloper, readAllDevelopers, readDeveloperWithId, updateDeveloper} from './logics/developers.logics'
import {ensureEmailExists, ensureIdExists, verifyDevInfoId} from './middlewares/middlewares.developers'
import {ensureDevExists, ensureIdProjectExists} from './middlewares/middlewares.projects'
import {createDeveloperExtraInformation, updateDeveloperInfo} from './logics/developersInfo.logics'
import {createProject, deleteProject, editProject, readAllProjects, readOneProjectWithId} from './logics/projects.logics'

const app: Application = express()
app.use(express.json())

app.post('/developers', ensureEmailExists,createDeveloper)
app.get('/developers', readAllDevelopers)
app.get('/developers/:id',ensureIdExists, readDeveloperWithId)
app.post('/developers/:id/infos',ensureIdExists, createDeveloperExtraInformation)

app.patch('/developers/:id', ensureIdExists,ensureEmailExists,updateDeveloper)
app.patch('/developers/:id/infos',ensureIdExists,updateDeveloperInfo)
app.delete('/developers/:id',ensureIdExists,verifyDevInfoId,deleteDevloper)

app.post('/projects',ensureDevExists,createProject)
app.get('/projects',readAllProjects)
app.get('/projects/:id',ensureIdProjectExists,readOneProjectWithId)
app.patch('/projects/:id',ensureIdProjectExists,editProject)
app.delete('/projects/:id',ensureIdProjectExists,deleteProject)

app.listen('3000', async () => {
    console.log('Server is running')
    await startDatabase()
})