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

  static async LikeComment(commentId: string): Promise<boolean> {
    try {
      const res = await CommentsModel.updateOne(
        { _id: new ObjectId(commentId) },
        {
          $inc: { "likesInfo.likesCount": 1 },
        }
      );

      if (res.matchedCount > 0) return true;
    } catch (error) {
      console.error("Error liking the comment:", error);
      throw error;
    }
  }

  static async DislikeComment(commentId: string): Promise<boolean> {
    try {
      const res = await CommentsModel.updateOne(
        { _id: new ObjectId(commentId) },
        {
          $inc: { "likesInfo.dislikesCount": -1 },
        }
      );

      if (res.matchedCount > 0) return true;
    } catch (error) {
      console.error("Error liking the comment:", error);
      throw error;
    }
  }

  static async deleteComment(commentId: string): Promise<boolean> {
    const res = await CommentsModel.deleteOne({
      _id: new ObjectId(commentId),
    });
    return !!res.deletedCount;
  }

  static async likeComment(
    likeStatus: LikeStatus,
    authorId: string,
    userId: string
  ) {}
}
