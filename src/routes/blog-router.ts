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
  res.send(blogs).sendStatus(200);
});

blogsRouter.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const id = req.params.id;
  const foundedBlog = await blogsRepository.getBlogById(req.params.id);
  if (!ObjectId.isValid(id)) {
    res.sendStatus(404);
  }
  res.send(foundedBlog).sendStatus(200);

  if (!foundedBlog) {
    res.sendStatus(404);
    return;
  }
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
    const { name, description, websiteUrl } = req.body;
    const updateData = { name, description, websiteUrl };
    const id = req.params.id;
    const blog = await blogsRepository.updateBlog(id, updateData);
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
