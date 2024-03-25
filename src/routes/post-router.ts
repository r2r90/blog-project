import { Request, Response, Router } from "express";
import { PostRepository } from "../repositories/post-repositories/post.repository";
import {
  HTTP_RESPONSE_CODES,
  ParamType,
  QueryInputModel,
  RequestWithBody,
  RequestWithParamAndBody,
  RequestWithParamAndQuery,
  RequestWithQuery,
} from "../types/common";

import { basicAuthMiddleware } from "../middlewares/auth/basic-auth-middleware";
import { createPostValidation } from "../middlewares/validators/post-validators";
import { ObjectId } from "mongodb";
import {
  PostCreateInputType,
  PostUpdateInputType,
} from "../types/posts/post-input-model/post.input.model";
import { PostQueryRepository } from "../repositories/post-repositories/post.query.repository";
import { PostService } from "../services/post-service";
import { jwtAccessGuard } from "../middlewares/auth/jwt-access-guard";
import { commentValidator } from "../middlewares/validators/comment-validator";
import { CommentCreateInputModel } from "../types/comments/comment.input.model";
import { CommentQueryRepository } from "../repositories/comment-repositories/comment.query.repository";
import { CommentQueryInputModel } from "../types/comments/comment.query.input";

export const postRouter = Router();

postRouter.get(
  "/",
  async (req: RequestWithQuery<QueryInputModel>, res: Response) => {
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

postRouter.get(
  "/:id/comments",
  async (
    req: RequestWithParamAndQuery<ParamType, CommentQueryInputModel>,
    res: Response
  ) => {
    const postId = req.params.id;
    const sortData = {
      pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
      pageSize: req.query.pageSize ? +req.query.pageSize : 10,
      sortBy: req.query.sortBy ?? "createdAt",
      sortDirection: req.query.sortDirection ?? "desc",
    };

    if (!ObjectId.isValid(postId)) {
      res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
      return;
    }

    const post = await PostQueryRepository.getPostById(postId);
    if (!post) {
      res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
      return;
    }

    const comments = await CommentQueryRepository.getAllCommentsByPostId(
      postId,
      sortData
    );

    comments
      ? res.status(HTTP_RESPONSE_CODES.SUCCESS).send(comments)
      : res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
  }
);

postRouter.post(
  "/",
  basicAuthMiddleware,
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
  basicAuthMiddleware,
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
  basicAuthMiddleware,
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

postRouter.post(
  "/:id/comments",
  jwtAccessGuard,
  commentValidator(),
  async (
    req: RequestWithParamAndBody<{ id: string }, CommentCreateInputModel>,
    res: Response
  ) => {
    const postId = req.params.id;
    const content = req.body.content;

    const comment = await PostService.addCommentToPost(
      postId,
      content,
      req.userId!
    );

    if (!comment) {
      res.sendStatus(404);
      return;
    }

    res.status(201).send(comment);
  }
);
