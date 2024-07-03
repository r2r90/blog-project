import { Request, Response, Router } from "express";
import { basicAuthMiddleware } from "../middlewares/auth/basic-auth-middleware";
import { blogValidation } from "../middlewares/validators/blog-validators";
import {
  BlogCreateInputType,
  BlogUpdateInputType,
} from "../types/blogs/blog-input-model/blog.input.model";
import {
  HTTP_RESPONSE_CODES,
  ParamType,
  RequestWithBody,
  RequestWithParamAndBody,
  RequestWithParamAndQuery,
  RequestWithQuery,
  ResponseType,
} from "../types/common";
import { ObjectId } from "mongodb";
import { BlogQueryInputModel } from "../types/blogs/blog-input-model/blog.query.input.model";
import { createPostFromBlogValidation } from "../middlewares/validators/post-validators";
import { PostOutputType } from "../types/posts/post.output.model";
import { BlogService } from "../services/blog-service";
import { PostQueryInputModel } from "../types/posts/post-input-model/post.query.input.model";
import { CreatePostFromBlogInputModel } from "../types/posts/post-input-model/create.post.from.blog.input.model";
import { PostService } from "../services/post-service";

export const blogsRoute = Router();

blogsRoute.get(
  "/",
  async (req: RequestWithQuery<BlogQueryInputModel>, res: Response) => {
    // const sortData = {
    //   searchNameTerm: req.query.searchNameTerm ?? null,
    //   sortBy: req.query.sortBy ?? "createdAt",
    //   sortDirection: req.query.sortDirection ?? "desc",
    //   pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
    //   pageSize: req.query.pageSize ? +req.query.pageSize : 10,
    // };
    // const blogs = await BlogService.getAllBlogs(sortData);

    const blogs = ["a", "b", "c"];
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
    const foundedBlog = await BlogService.getBlogById(id);
    if (!foundedBlog) {
      return res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
    }
    return res.send(foundedBlog).status(HTTP_RESPONSE_CODES.SUCCESS);
  }
);

blogsRoute.get(
  "/:id/posts",
  async (
    req: RequestWithParamAndQuery<ParamType, PostQueryInputModel>,
    res: Response
  ) => {
    const blogId = req.params.id;
    const sortData = {
      pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
      pageSize: req.query.pageSize ? +req.query.pageSize : 10,
      sortBy: req.query.sortBy ?? "createdAt",
      sortDirection: req.query.sortDirection ?? "desc",
    };

    if (!ObjectId.isValid(blogId)) {
      res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
      return;
    }

    const blog = await BlogService.getBlogById(blogId);
    if (!blog) {
      res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
      return;
    }

    const posts = await PostService.getAllPostsByBlogId(blogId, sortData);

    posts
      ? res.status(HTTP_RESPONSE_CODES.SUCCESS).send(posts)
      : res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
  }
);

blogsRoute.post(
  "/",
  basicAuthMiddleware,
  blogValidation(),
  async (req: RequestWithBody<BlogCreateInputType>, res: Response) => {
    const { name, websiteUrl, description } = req.body;
    const blog = await BlogService.createBlog({
      name,
      websiteUrl,
      description,
    });
    res.status(201).send(blog);
  }
);

blogsRoute.post(
  "/:id/posts",
  basicAuthMiddleware,
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

    const post = await PostService.createPostToBlog(id, req.body);

    return post
      ? res.status(HTTP_RESPONSE_CODES.CREATED).send(post)
      : res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
  }
);

blogsRoute.put(
  "/:id",
  basicAuthMiddleware,
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
    const isUpdated = await BlogService.updateBlog({ id, ...blogUpdateData });
    if (!isUpdated) {
      res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
      return;
    }
    res.sendStatus(HTTP_RESPONSE_CODES.NO_CONTENT);
  }
);

blogsRoute.delete(
  "/:id",
  basicAuthMiddleware,
  async (req: Request<ParamType>, res: Response) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
      return;
    }
    const isBlogDeleted = await BlogService.deleteBlog(id);
    if (!isBlogDeleted) {
      res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
      return;
    }
    res.sendStatus(HTTP_RESPONSE_CODES.NO_CONTENT);
  }
);
