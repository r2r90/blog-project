import { Request, Response, Router } from "express";
import { BlogRepository } from "../repositories/blog.repository";
import { authMiddleware } from "../middlewares/auth/auth-middleware";
import { blogValidation } from "../middlewares/validators/blog-validators";
import {
  BlogCreateInputType,
  BlogUpdateInputType,
} from "../models/blogs/blog-input-model/blog.input.model";
import {
  HTTP_RESPONSE_CODES,
  ParamType,
  RequestWithBody,
  RequestWithParamAndBody,
  RequestWithParamAndQuery,
  RequestWithQuery,
  ResponseType,
} from "../models/common/common";
import { ObjectId } from "mongodb";
import { BlogQueryInputModel } from "../models/blogs/blog-input-model/blog.query.input.model";
import { BlogQueryRepository } from "../repositories/blog.query.repository";
import { createPostFromBlogValidation } from "../middlewares/validators/post-validators";
import { CreatePostFromBlogInputModel } from "../models/blogs/blog-input-model/create.post.from.blog.input.model";
import { PostOutputType } from "../models/posts/post.output.model";
import { BlogService } from "../services/blog.service";

export const blogsRoute = Router();

blogsRoute.get(
  "/",
  async (req: RequestWithQuery<BlogQueryInputModel>, res: Response) => {
    const sortData = {
      searchNameTerm: req.query.searchNameTerm ?? null,
      sortBy: req.query.sortBy ?? "createdAt",
      sortDirection: req.query.sortDirection ?? "desc",
      pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
      pageSize: req.query.pageSize ? +req.query.pageSize : 10,
    };
    const blogs = await BlogQueryRepository.getAllBlogs(sortData);
    res.send(blogs).status(HTTP_RESPONSE_CODES.SUCCESS);
  }
);

blogsRoute.get(
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
    const foundedBlog = await BlogQueryRepository.getBlogById(id);
    if (!foundedBlog) {
      return res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
    }
    return res.send(foundedBlog).status(HTTP_RESPONSE_CODES.SUCCESS);
  }
);

blogsRoute.post(
  "/",
  authMiddleware,
  blogValidation(),
  async (req: RequestWithBody<BlogCreateInputType>, res: Response) => {
    const { name, websiteUrl, description } = req.body;
    const blog = await BlogRepository.createBlog({
      name,
      websiteUrl,
      description,
    });
    res.status(201).send(blog);
  }
);

blogsRoute.post(
  "/:id/posts",
  authMiddleware,
  createPostFromBlogValidation(),
  async (
    req: RequestWithParamAndBody<ParamType, CreatePostFromBlogInputModel>,
    res: ResponseType<PostOutputType>
  ) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
      return;
    }

    const post = await BlogService.createPostToBlog(id, req.body);

    return post
      ? res.status(HTTP_RESPONSE_CODES.SUCCESS).send(post)
      : res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
  }
);

blogsRoute.post(
  "/:id/posts",
  authMiddleware,
  createPostFromBlogValidation(),
  async (
    req: RequestWithParamAndBody<ParamType, CreatePostFromBlogInputModel>,
    res: ResponseType<PostOutputType>
  ) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      res.sendStatus(HTTP_RESPONSE_CODES.BAD_REQUEST);
      return;
    }

    const createPostFromBlogModel = {
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
    };

    const post = await BlogService.createPostToBlog(
      id,
      createPostFromBlogModel
    );

    return post
      ? res.status(HTTP_RESPONSE_CODES.CREATED).send(post)
      : res.sendStatus(HTTP_RESPONSE_CODES.BAD_REQUEST);
  }
);

blogsRoute.put(
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
    const isUpdated = await BlogRepository.updateBlog(id, blogUpdateData);

    if (!isUpdated) {
      res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
      return;
    }

    res.sendStatus(HTTP_RESPONSE_CODES.NO_CONTENT);
  }
);

blogsRoute.delete(
  "/:id",
  authMiddleware,
  async (req: Request<ParamType>, res: Response) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
      return;
    }
    const isBlogDeleted = await BlogRepository.deleteBlog(id);
    if (!isBlogDeleted) {
      res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
      return;
    }
    res.sendStatus(HTTP_RESPONSE_CODES.NO_CONTENT);
  }
);
