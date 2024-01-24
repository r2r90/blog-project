import { Request, Response, Router } from "express";
import { blogsRepository } from "../repositories/blogs-repository";
import { authMiddleware } from "../middlewares/auth/auth-middleware";
import { blogValidation } from "../middlewares/validators/blog-validators";
import { BlogInputType, BlogUpdateType } from "../models/blogs/input";
import {
  ParamType,
  RequestWithBody,
  RequestWithParamAndBody,
} from "../models/common";

export const blogsRouter = Router();

blogsRouter.get("/", (req: Request, res: Response) => {
  const blogs = blogsRepository.getAll();
  res.send(blogs).sendStatus(200);
});

blogsRouter.get("/:id", (req: Request<{ id: string }>, res: Response) => {
  const foundedBlog = blogsRepository.getBlogById(req.params.id);
  if (!foundedBlog) {
    res.send(404);
  }
  res.send(foundedBlog).sendStatus(200);
});

blogsRouter.post(
  "/",
  authMiddleware,
  blogValidation(),
  (req: RequestWithBody<BlogInputType>, res: Response) => {
    const { name, description, websiteUrl } = req.body;

    const newBlog = {
      id: Date.now().toString(),
      name,
      description,
      websiteUrl,
    };
    const createdBlog = blogsRepository.createBlog(newBlog);
    res.status(201).send(createdBlog);
  }
);
blogsRouter.put(
  "/:id",
  authMiddleware,
  blogValidation(),
  (req: RequestWithParamAndBody<ParamType, BlogUpdateType>, res: Response) => {
    const blogToUpdate = blogsRepository.getBlogById(req.params.id);
    if (!blogToUpdate) {
      res.status(404).send("Blog not found");
      return;
    }
    const updates = req.body;
    const updatedBlog = blogsRepository.updateBlog(blogToUpdate, updates);

    if (updatedBlog) {
      res.sendStatus(204);
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
);

blogsRouter.delete(
  "/:id",
  authMiddleware,
  (req: Request<ParamType>, res: Response) => {
    const blogToDelete = blogsRepository.getBlogById(req.params.id);
    if (!blogToDelete) {
      res.sendStatus(404);
      return;
    } else {
      blogsRepository.deleteBlog(req.params.id);
      res.send(204);
    }
  }
);
