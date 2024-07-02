// @ts-nocheck

import { WithId } from "mongodb";
import { CommentDbType, LikeStatus } from "../../db/schemas/comments-schema";

export const commentMapper = (
  comment: WithId<CommentDbType>
): {
  createdAt: string;
  commentatorInfo: { userLogin: string; userId: string };
  id: string;
  content: string;
  likesInfo: { likesCount: number; dislikesCount: number; myStatus: any };
} => ({
  id: comment._id.toString(),
  content: comment.content,
  createdAt: comment.createdAt,
  commentatorInfo: {
    userId: comment.commentatorInfo.userId,
    userLogin: comment.commentatorInfo.userLogin,
  },
  likesInfo: {
    likesCount: comment.likesInfo.likesCount,
    dislikesCount: comment.likesInfo.disLikesCount,
    myStatus:
      comment.likesInfo.usersLiked?.find(
        (like: LikeStatus.Like) => like.userId === userId // @ts-ignore comment above the problematic line
      )?.likeStatus || "None",
  },
});
