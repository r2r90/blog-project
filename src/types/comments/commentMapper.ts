import { WithId } from "mongodb";
import { CommentDBType, LikeStatus } from "../../db/schemas/comments-schema";

export const commentMapper = (
  comment: WithId<CommentDBType>,
  userId?: string | null
) => ({
  id: comment._id.toString(),
  content: comment.content,
  createdAt: comment.createdAt,
  commentatorInfo: {
    userId: comment.commentatorInfo.userId,
    userLogin: comment.commentatorInfo.userLogin,
  },
  likesInfo: {
    likesCount: comment.likesInfo.likesCount,
    dislikesCount: comment.likesInfo.dislikesCount,
    myStatus:
      comment.likesInfo.usersLiked?.find((like) => like.likedUserId === userId)
        ?.likesStatus || LikeStatus.None,
  },
});
