import { Request, Response, Router } from "express";
import { postsRepository } from "../repositories/posts-repository";
import {
  ParamType,
  RequestWithBody,
  RequestWithParamAndBody,
} from "../models/common";
import { PostInputType } from "../models/posts/input";
import { authMiddleware } from "../middlewares/auth/auth-middleware";
import { postValidation } from "../middlewares/validators/post-validators";

export const postsRouter = Router();

postsRouter.get("/", (req: Request, res: Response) => {
  let posts = postsRepository.getAll();
  res.send(posts).status(201);
});

postsRouter.get("/:id", (req: Request<ParamType>, res: Response) => {
  let post = postsRepository.getPostById(req.params.id);
  post ? res.send(post) : res.send(404);
});

postsRouter.post(
  "/",
  authMiddleware,
  postValidation(),
  (req: RequestWithBody<PostInputType>, res: Response) => {
    let newPost = postsRepository.createPost(req.body);
    newPost ? res.send(newPost).status(201) : res.send(400);
  }
);

postsRouter.put(
  "/:id",
  authMiddleware,
  postValidation(),
  (req: RequestWithParamAndBody<ParamType, PostInputType>, res: Response) => {
    const { id } = req.params;
    const updates = req.body;
    const foundedPost = postsRepository.getPostById(id);
    if (!foundedPost) {
      res.status(404).send("Post not found");
      return;
    }

    const updatedPost = postsRepository.updatePost(id, updates);

    updatedPost ? res.sendStatus(204) : res.sendStatus(400);
  }
);

postsRouter.delete(
  "/:id",
  authMiddleware,
  (req: Request<ParamType>, res: Response) => {
    const isDeleted = postsRepository.deletePost(req.params.id);
    isDeleted ? res.sendStatus(204) : res.status(404);
  }
);
