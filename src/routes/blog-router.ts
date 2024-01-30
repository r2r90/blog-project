import { Request, Response, Router } from "express";
import { blogsRepository } from "../repositories/blogs-repository";
import { authMiddleware } from "../middlewares/auth/auth-middleware";
import { blogValidation } from "../middlewares/validators/blog-validators";
import {
  BlogInputType,
  BlogUpdateType,
} from "../models/blogs/blog.input.model";
import {
  ParamType,
  RequestWithBody,
  RequestWithParamAndBody,
} from "../models/common/common";
import { ObjectId } from "mongodb";

export const blogsRouter = Router();

blogsRouter.get("/", async (req: Request, res: Response) => {
  const blogs = await blogsRepository.getAll();
  res.send(blogs).status(200);
});

blogsRouter.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    res.sendStatus(404);
    return;
  }
  const foundedBlog = await blogsRepository.getBlogById(req.params.id);
  res.send(foundedBlog).status(200);
});

blogsRouter.post(
  "/",
  authMiddleware,
  blogValidation(),
  async (req: RequestWithBody<BlogInputType>, res: Response) => {
    const { name, description, websiteUrl } = req.body;
    const newBlog = {
      name,
      description,
      websiteUrl,
    };
    const createdBlog = await blogsRepository.createBlog(newBlog);
    res.status(201).send(createdBlog);
  }
);
blogsRouter.put(
  "/:id",
  authMiddleware,
  blogValidation(),
  async (
    req: RequestWithParamAndBody<ParamType, BlogUpdateType>,
    res: Response
  ) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      res.sendStatus(404);
      return;
    }

    const { name, description, websiteUrl } = req.body;
    const updateData = { name, description, websiteUrl };
    const isUpdated = await blogsRepository.updateBlog(id, updateData);

    if (!isUpdated) {
      res.sendStatus(404);
      return;
    }

    res.sendStatus(204);
  }
);

blogsRouter.delete(
  "/:id",
  authMiddleware,
  async (req: Request<ParamType>, res: Response) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      res.sendStatus(404);
      return;
    }
    const isDeleted = await blogsRepository.deleteBlog(id);
    if (!isDeleted) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  }
);
