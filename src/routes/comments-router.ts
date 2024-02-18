import { Response, Router } from "express";
import {
  HTTP_RESPONSE_CODES,
  RequestWithParam,
  RequestWithParamAndBody,
} from "../types/common/common";
import { CommentQueryRepository } from "../repositories/comment-repositories/comment.query.repository";
import { CommentCreateInputModel } from "../types/comments/comment.input.model";
import { jwtAccessGuard } from "../middlewares/auth/jwt-access-guard";
import { commentValidator } from "../middlewares/validators/comment-validator";
import { CommentRepository } from "../repositories/comment-repositories/comment.repository";
import { ObjectId } from "mongodb";

export const commentsRouter = Router();

commentsRouter.get(
  "/:id",
  async (req: RequestWithParam<{ id: string }>, res: Response) => {
    if (!ObjectId.isValid(req.params.id)) {
      res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
      return;
    }
    const foundedComment = await CommentQueryRepository.getCommentById(
      req.params.id
    );
    if (!foundedComment) {
      res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
      return;
    }
    return res.send(foundedComment).status(HTTP_RESPONSE_CODES.SUCCESS);
  }
);

commentsRouter.put(
  "/:id",
  jwtAccessGuard,
  commentValidator(),
  async (
    req: RequestWithParamAndBody<{ id: string }, CommentCreateInputModel>,
    res: Response
  ) => {
    const commentId = req.params.id;
    const { content } = req.body;

    if (!ObjectId.isValid(commentId)) {
      res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
      return;
    }

    const isCommentUpdated = await CommentRepository.UpdateComment(
      commentId,
      content
    );

    isCommentUpdated
      ? res.sendStatus(HTTP_RESPONSE_CODES.NO_CONTENT)
      : res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
  },

  commentsRouter.delete(
    "/:id",
    jwtAccessGuard,
    async (req: RequestWithParam<{ id: string }>, res: Response) => {
      const id = req.params.id;
      const isCommentDeleted = CommentRepository.deleteComment(id);

      if (!ObjectId.isValid(id)) {
        res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
        return;
      }
      if (!isCommentDeleted) {
        res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
        return;
      }
      res.sendStatus(HTTP_RESPONSE_CODES.NO_CONTENT);
    }
  )
);
