import express, {Request, Response} from 'express'
import {blogsRouter} from "./routes/blog-router";

export const app = express()

app.use(express.json())


app.get('/', (req:Request, res:Response) =>{
    res.send('Hello')
})

app.use('/blogs', blogsRouter)
