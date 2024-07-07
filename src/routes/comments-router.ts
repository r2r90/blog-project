import { Response, Router } from "express";
import {
  HTTP_RESPONSE_CODES,
  RequestWithParam,
  RequestWithParamAndBody,
} from "../types/common";
import { CommentQueryRepository } from "../repositories/comment-repositories/comment.query.repository";
import { CommentCreateInputModel } from "../types/comments/comment.input.model";
import { jwtAccessGuard } from "../middlewares/auth/jwt-access-guard";
import { CommentRepository } from "../repositories/comment-repositories/comment.repository";
import { ObjectId } from "mongodb";
import { LikeStatus } from "../db/schemas/comments-schema";
import { LikeService } from "../services/like-service";
import { likeStatusValidator } from "../middlewares/validators/like-validator";

export const commentsRouter = Router();

commentsRouter.put(
  "/:id/like-status",
  jwtAccessGuard,
  likeStatusValidator(),
  async (
    req: RequestWithParamAndBody<{ id: string }, { likeStatus: LikeStatus }>,
    res: Response
  ) => {
    const commentId = req.params.id;

    if (!ObjectId.isValid(commentId)) {
      res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
      return;
    }
    const commentToLike = await CommentQueryRepository.getCommentById(
      commentId
    );

    if (!commentToLike) {
      res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
      return;
    }

    const isAuthor = commentToLike.commentatorInfo.userId === req.userId;
    const likeStatus = req.body.likeStatus;

    const commentLiked = await LikeService.likeComment(
      commentId,
      isAuthor,
      likeStatus
    );

    commentLiked ? res.sendStatus(204) : res.send("Error");
  }
);

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
    const commentToUpdate = await CommentQueryRepository.getCommentById(
      commentId
    );

    if (!commentToUpdate) {
      res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
      return;
    }
    const authorId = commentToUpdate.commentatorInfo.userId;
    const isAuthor = authorId === req.userId;

    if (!isAuthor) {
      res.sendStatus(HTTP_RESPONSE_CODES.FORBIDDEN);
      return;
    }

    const isCommentUpdated = await CommentRepository.UpdateComment(
      commentId,
      content
    );

    isCommentUpdated
      ? res.sendStatus(HTTP_RESPONSE_CODES.NO_CONTENT)
      : res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
  }
);

commentsRouter.delete(
  "/:id",
  jwtAccessGuard,
  async (req: RequestWithParam<{ id: string }>, res: Response) => {
    const commentId = req.params.id;
    const commentToDelete = await CommentQueryRepository.getCommentById(
      commentId
    );

    if (!commentToDelete) {
      res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
      return;
    }
    const authorId = commentToDelete.commentatorInfo.userId;
    const isAuthor = authorId === req.userId;

    if (!isAuthor) {
      res.sendStatus(HTTP_RESPONSE_CODES.FORBIDDEN);
      return;
    }

    const isCommentDeleted = CommentRepository.deleteComment(commentId);

    if (!ObjectId.isValid(commentId)) {
      res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
      return;
    }

    if (!isCommentDeleted) {
      res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
      return;
    }

    res.sendStatus(HTTP_RESPONSE_CODES.NO_CONTENT);
  }
);
