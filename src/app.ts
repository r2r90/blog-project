import express, {Request, Response} from 'express'
import {blogsDb} from "./db/db";
import {blogsRouter} from "./routes/blog-router";

export const app = express()

app.use(express.json())


app.get('/', (req:Request, res:Response) =>{
    res.send('Hello')
})

app.use('/blogs', blogsRouter)
