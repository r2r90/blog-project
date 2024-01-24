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
    const foundedBlog = blogsRepository.getBlogById(req.params.id);
    if (!foundedBlog) {
      res.status(404).send("Blog not found");
      return;
    }

    const { id } = req.params;
    const updates = req.body;

    const updatedBlog = blogsRepository.updateBlog(id, updates);

    if (updatedBlog) {
      res.status(204).send(updatedBlog);
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
);

blogsRouter.delete("/:id", authMiddleware, (req: Request, res: Response) => {
  const isDeleted = blogsRepository.deleteBlog(req.params.id);
  if (isDeleted) {
    res.send(204);
  } else {
    res.send(404);
  }
});
