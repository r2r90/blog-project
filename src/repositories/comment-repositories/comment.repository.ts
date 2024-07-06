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

  static async deleteComment(commentId: string): Promise<boolean> {
    const res = await CommentsModel.deleteOne({
      _id: new ObjectId(commentId),
    });
    return !!res.deletedCount;
  }
}
