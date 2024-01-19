import {Request, Response, Router} from "express";
import {db} from "../db/db";

export const blogsRouter = Router()

blogsRouter.get('/', (req: Request, res: Response) => {
    res.send(db.blogsDb)
})

blogsRouter.get('/:id', (req: Request, res: Response) => {
    let foundBlogById = db.blogsDb.find((b) => b.id === req.params.id)
    if (foundBlogById){
        res.status(200).send(foundBlogById)
    }else {
        res.status(400).send('Please provide a valid ID for the resource lookup')
    }
})


blogsRouter.post('/', (req: Request, res: Response) => {

})
