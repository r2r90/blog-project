import { Request, Response, Router } from "express";
import { db } from "../db/db";
import { blogsRepository } from "../repositories/blogs-repository";
import { authMiddleware } from "../middlewares/auth/auth-middleware";

export const blogsRouter = Router();

blogsRouter.get("/", (req: Request, res: Response) => {
  res.send(db.blogsDb);
});

blogsRouter.get("/:id", (req: Request, res: Response) => {
  const foundedBlog = blogsRepository.findBlogById(req.params.id);
  res.status(200).send(foundedBlog);
});

blogsRouter.post("/", authMiddleware, (req: Request, res: Response) => {});
