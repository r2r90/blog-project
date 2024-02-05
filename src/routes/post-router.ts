import { Request, Response, Router } from "express";
import { postRepository } from "../repositories/post.repository";
import {
  HTTP_RESPONSE_CODES,
  ParamType,
  RequestWithBody,
  RequestWithParamAndBody,
} from "../models/common/common";

import { authMiddleware } from "../middlewares/auth/auth-middleware";
import { createPostValidation } from "../middlewares/validators/post-validators";
import { ObjectId } from "mongodb";
import {
  PostCreateInputType,
  PostUpdateInputType,
} from "../models/posts/post.input.model";

export const postRouter = Router();

postRouter.get("/", async (req: Request, res: Response) => {
  let posts = await postRepository.getAll();
  res.send(posts).status(HTTP_RESPONSE_CODES.SUCCESS);
});

postRouter.get("/:id", async (req: Request<ParamType>, res: Response) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
    return;
  }
  let post = await postRepository.getPostById(id);
  post ? res.send(post) : res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
});

postRouter.post(
  "/",
  authMiddleware,
  createPostValidation(),
  async (req: RequestWithBody<PostCreateInputType>, res: Response) => {
    const { title, shortDescription, content, blogId }: PostCreateInputType =
      req.body;
    const newPost: PostCreateInputType = {
      title,
      shortDescription,
      content,
      blogId,
    };
    let createdPost = await postRepository.createPost(newPost);
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
    if (!ObjectId.isValid(id)) {
      res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
      return;
    }
    const { title, shortDescription, content, blogId } = req.body;
    const postUpdateData = { title, shortDescription, content, blogId };
    const isPostUpdated = await postRepository.updatePost(id, postUpdateData);
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

    const isPostDeleted = await postRepository.deletePost(id);
    if (!isPostDeleted) {
      res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
      return;
    }
    res.sendStatus(HTTP_RESPONSE_CODES.NO_CONTENT);
  }
);