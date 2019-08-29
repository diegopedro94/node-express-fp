import dotenv from 'dotenv'
import express from 'express'
import * as bodyParser from 'body-parser'
import { createUser } from './controllers/userController'
import { userMiddleware } from './middlewares/userMiddleware'

dotenv.config()
const port = process.env.SERVER_PORT
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/user', userMiddleware, createUser)

app.listen(port, () => {
    // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${ port }`)
})
