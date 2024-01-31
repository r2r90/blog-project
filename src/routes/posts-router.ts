import { Request, Response, Router } from "express";
import { postsRepository } from "../repositories/posts-repository";
import {
  HTTP_RESPONSE_CODES,
  ParamType,
  RequestWithBody,
  RequestWithParamsAndBody,
} from "../models/common/common";

import { authMiddleware } from "../middlewares/auth/auth-middleware";
import { postValidation } from "../middlewares/validators/post-validators";
import { ObjectId } from "mongodb";
import {
  PostCreateInputType,
  PostUpdateInputType,
} from "../models/posts/post.input.model";

export const postsRouter = Router();

postsRouter.get("/", async (req: Request, res: Response) => {
  let posts = await postsRepository.getAll();
  res.send(posts).status(HTTP_RESPONSE_CODES.SUCCESS);
});

postsRouter.get("/:id", async (req: Request<ParamType>, res: Response) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
    return;
  }
  let post = await postsRepository.getPostById(id);
  post ? res.send(post) : res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
});

postsRouter.post(
  "/",
  authMiddleware,
  postValidation(),
  async (req: RequestWithBody<PostCreateInputType>, res: Response) => {
    const { title, shortDescription, content, blogId }: PostCreateInputType =
      req.body;
    const newPost: PostCreateInputType = {
      title,
      shortDescription,
      content,
      blogId,
    };
    let createdPost = await postsRepository.createPost(newPost);
    createdPost
      ? res.status(HTTP_RESPONSE_CODES.CREATED).send(createdPost)
      : res.send(HTTP_RESPONSE_CODES.NOT_FOUND);
  }
);

postsRouter.put(
  "/:id",
  authMiddleware,
  postValidation(),
  async (
    req: RequestWithParamsAndBody<ParamType, PostUpdateInputType>,
    res: Response
  ) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
      return;
    }
    const { title, shortDescription, content, blogId } = req.body;
    const postUpdateData = { title, shortDescription, content, blogId };
    const isPostUpdated = await postsRepository.updatePost(id, postUpdateData);
    isPostUpdated
      ? res.sendStatus(HTTP_RESPONSE_CODES.NO_CONTENT)
      : res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
  }
);

postsRouter.delete(
  "/:id",
  authMiddleware,
  async (req: Request<ParamType>, res: Response) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
      return;
    }

    const isPostDeleted = await postsRepository.deletePost(id);
    if (!isPostDeleted) {
      res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
      return;
    }
    res.sendStatus(HTTP_RESPONSE_CODES.NO_CONTENT);
  }
);
