import { WithId } from "mongodb";
import { CommentViewModel } from "./comments.output.model";
import { CommentDbType, LikeStatus } from "../../db/schemas/comments-schema";

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
  likesInfo: {
    likesCount: comment.likesInfo.likesCount,
    dislikesCount: comment.likesInfo.disLikesCount,
    myStatus:
      comment.likesInfo.usersLiked?.find((like) => like.userId === userId)
        ?.likeStatus || "None",
  },
});
