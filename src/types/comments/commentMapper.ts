import { WithId } from "mongodb";
import { CommentDbType } from "../db-types";
import { CommentViewModel } from "./comments.output.model";

export const commentMapper = (
  comment: WithId<CommentDbType>
): CommentViewModel => ({
  id: comment._id.toString(),
  content: comment.content,
  createdAt: comment.createdAt,
  commentatorInfo: {
    userId: comment.commentatorInfo.userId,
    userLogin: comment.commentatorInfo.userLogin,
  },
});
