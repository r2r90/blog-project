import { CommentViewModel } from "../../types/comments/comments.output.model";
import { ObjectId } from "mongodb";
import {
  CommentDBType,
  CommentsModel,
  LikeStatus,
} from "../../db/schemas/comments-schema";

export class CommentRepository {
  static async createComment(
    commentToCreate: CommentDBType
  ): Promise<CommentViewModel | null> {
    const createdComment = await CommentsModel.create(commentToCreate);

    if (!createdComment) return null;

    return {
      id: createdComment.id,
      createdAt: commentToCreate.createdAt,
      content: commentToCreate.content,
      commentatorInfo: {
        userId: commentToCreate.commentatorInfo.userId,
        userLogin: commentToCreate.commentatorInfo.userLogin,
      },
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatus.None,
      },
    };
  }

  static async UpdateComment(
    commentId: string,
    updatedContent: string
  ): Promise<boolean | null> {
    const res = await CommentsModel.updateOne(
      { _id: new ObjectId(commentId) },
      {
        $set: { content: updatedContent },
      }
    );
    return !!res.matchedCount;
  }

  static async LikeComment(
    commentId: string,
    userId: string | null,
    newLikeStatus: LikeStatus
  ) {
    const comment = await CommentsModel.findOne({ _id: commentId });
    const userLiked = comment?.likesInfo.usersLiked?.find(
      (like) => like.likedUserId === userId
    );

    if (!comment) return false;

    if (!userLiked && userId) {
      comment.likesInfo.usersLiked?.push({
        likedUserId: userId,
        likesStatus: newLikeStatus,
      });
      if (newLikeStatus === LikeStatus.Like) {
        comment.likesInfo.likesCount += 1;
      } else if (newLikeStatus === LikeStatus.Dislike) {
        comment.likesInfo.dislikesCount += 1;
      }
    }

    if (userLiked) {
      if (
        (newLikeStatus === LikeStatus.Like &&
          userLiked.likesStatus === LikeStatus.Like) ||
        (newLikeStatus === LikeStatus.Dislike &&
          userLiked.likesStatus === LikeStatus.Dislike)
      ) {
        comment.likesInfo.usersLiked = comment?.likesInfo.usersLiked?.filter(
          (like) => like.likedUserId !== userId
        );

        await comment!.save();

        if (
          newLikeStatus === LikeStatus.Like &&
          userLiked.likesStatus === LikeStatus.Like
        ) {
          comment.likesInfo.likesCount -= 1;
        } else if (
          newLikeStatus === LikeStatus.Dislike &&
          userLiked.likesStatus === LikeStatus.Dislike
        ) {
          comment.likesInfo.dislikesCount -= 1;
        }
      }
    }

    await comment!.save();
  }

  static async deleteComment(commentId: string): Promise<boolean> {
    const res = await CommentsModel.deleteOne({
      _id: new ObjectId(commentId),
    });
    return !!res.deletedCount;
  }
}
