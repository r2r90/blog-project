import { Request, Response, Router } from "express";
import { PostRepository } from "../repositories/post.repository";
import {
  HTTP_RESPONSE_CODES,
  ParamType,
  RequestWithBody,
  RequestWithParamAndBody,
  RequestWithQuery,
} from "../models/common/common";

import { authMiddleware } from "../middlewares/auth/auth-middleware";
import { createPostValidation } from "../middlewares/validators/post-validators";
import { ObjectId } from "mongodb";
import {
  PostCreateInputType,
  PostUpdateInputType,
} from "../models/posts/post-input-model/post.input.model";
import { PostQueryRepository } from "../repositories/post.query.repository";
import { PostQueryInputModel } from "../models/posts/post-input-model/post.query.input.model";
import { PostService } from "../services/post.service";

export const postRouter = Router();

postRouter.get(
  "/",
  async (req: RequestWithQuery<PostQueryInputModel>, res: Response) => {
    const sortData = {
      pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
      pageSize: req.query.pageSize ? +req.query.pageSize : 10,
      sortBy: req.query.sortBy ?? "createdAt",
      sortDirection: req.query.sortDirection ?? "desc",
    };
    let posts = await PostQueryRepository.getAllPosts(sortData);
    res.send(posts).status(HTTP_RESPONSE_CODES.SUCCESS);
  }
);

postRouter.get("/:id", async (req: Request<ParamType>, res: Response) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
    return;
  }
  let post = await PostService.getPostById(id);
  post ? res.send(post) : res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
});

postRouter.post(
  "/",
  authMiddleware,
  createPostValidation(),
  async (req: RequestWithBody<PostCreateInputType>, res: Response) => {
    const { title, shortDescription, content, blogId }: PostCreateInputType =
      req.body;
    const newPostData: PostCreateInputType = {
      title,
      shortDescription,
      content,
      blogId,
    };
    let createdPost = await PostService.createPost(newPostData);
    createdPost
      ? res.status(HTTP_RESPONSE_CODES.CREATED).send(createdPost)
      : res.send(HTTP_RESPONSE_CODES.NOT_FOUND);
  }
);

postRouter.put(
  "/:id",
  authMiddleware,
  createPostValidation(),
  async (
    req: RequestWithParamAndBody<ParamType, PostUpdateInputType>,
    res: Response
  ) => {
    const id = req.params.id;
    const { title, shortDescription, content, blogId } = req.body;
    const postUpdateData = { title, shortDescription, content, blogId };
    if (!ObjectId.isValid(id)) {
      res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
      return;
    }
    const isPostUpdated = await PostService.updatePost(id, postUpdateData);
    isPostUpdated
      ? res.sendStatus(HTTP_RESPONSE_CODES.NO_CONTENT)
      : res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
  }
);
postRouter.delete(
  "/:id",
  authMiddleware,
  async (req: Request<ParamType>, res: Response) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
      return;
    }

    const isPostDeleted = await PostRepository.deletePost(id);
    if (!isPostDeleted) {
      res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
      return;
    }
    res.sendStatus(HTTP_RESPONSE_CODES.NO_CONTENT);
  }
);
