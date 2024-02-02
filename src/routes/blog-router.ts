import { Request, Response, Router } from "express";
import { blogsRepository } from "../repositories/blogs.repository";
import { authMiddleware } from "../middlewares/auth/auth-middleware";
import { blogValidation } from "../middlewares/validators/blog-validators";
import {
  BlogCreateInputType,
  BlogUpdateInputType,
} from "../models/blogs/blog.input.model";
import {
  HTTP_RESPONSE_CODES,
  ParamType,
  RequestWithBody,
  RequestWithParamAndBody,
  RequestWithParamAndQuery,
  RequestWithQuery,
} from "../models/common/common";
import { ObjectId } from "mongodb";
import { BlogQueryInputModel } from "../models/blogs/blog.query.input.model";
import { blogsQueryRepository } from "../repositories/blogs.query.repository";

export const blogsRouter = Router();

blogsRouter.get(
  "/",
  async (req: RequestWithQuery<BlogQueryInputModel>, res: Response) => {
    const sortData = {
      searchNameTerm: req.query.searchNameTerm ?? null,
      sortBy: req.query.sortBy ?? "createdAt",
      sortDirection: req.query.sortDirection ?? "desc",
      pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
      pageSize: req.query.pageSize ? +req.query.pageSize : 10,
    };
    const blogs = await blogsQueryRepository.getAllBlogs(sortData);
    res.send(blogs).status(HTTP_RESPONSE_CODES.SUCCESS);
  }
);

blogsRouter.get(
  "/:id",
  async (
    req: RequestWithParamAndQuery<ParamType, BlogQueryInputModel>,
    res: Response
  ) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
      return;
    }
    const foundedBlog = await blogsQueryRepository.getBlogById(id);
    if (!foundedBlog) {
      return res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
    }
    return res.send(foundedBlog).status(HTTP_RESPONSE_CODES.SUCCESS);
  }
);

blogsRouter.post(
  "/",
  authMiddleware,
  blogValidation(),
  async (req: RequestWithBody<BlogCreateInputType>, res: Response) => {
    const { name, description, websiteUrl } = req.body;
    const newBlog = {
      name,
      description,
      websiteUrl,
    };
    const createdBlog = await blogsRepository.createBlog(newBlog);
    res.status(HTTP_RESPONSE_CODES.CREATED).send(createdBlog);
  }
);
blogsRouter.put(
  "/:id",
  authMiddleware,
  blogValidation(),
  async (
    req: RequestWithParamAndBody<ParamType, BlogUpdateInputType>,
    res: Response
  ) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
      return;
    }

    const { name, description, websiteUrl } = req.body;
    const blogUpdateData = { name, description, websiteUrl };
    const isUpdated = await blogsRepository.updateBlog(id, blogUpdateData);

    if (!isUpdated) {
      res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
      return;
    }

    res.sendStatus(HTTP_RESPONSE_CODES.NO_CONTENT);
  }
);

blogsRouter.delete(
  "/:id",
  authMiddleware,
  async (req: Request<ParamType>, res: Response) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
      return;
    }
    const isBlogDeleted = await blogsRepository.deleteBlog(id);
    if (!isBlogDeleted) {
      res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
      return;
    }
    res.sendStatus(HTTP_RESPONSE_CODES.NO_CONTENT);
  }
);
