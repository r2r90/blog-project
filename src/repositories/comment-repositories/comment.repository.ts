import { CommentViewModel } from "../../types/comments/comments.output.model";
import { commentsCollection, postsCollection } from "../../db/db";
import { CommentDbType } from "../../types/db-types";
import { ObjectId } from "mongodb";

export class CommentRepository {
  static async createComment(
    commentToCreate: CommentDbType
  ): Promise<CommentViewModel | null> {
    const createdComment = await commentsCollection.insertOne(commentToCreate);

    if (!createdComment) return null;

    return {
      id: createdComment.insertedId.toString(),
      createdAt: commentToCreate.createdAt,
      content: commentToCreate.content,
      commentatorInfo: {
        userId: commentToCreate.commentatorInfo.userId,
        userLogin: commentToCreate.commentatorInfo.userLogin,
      },
    };
  }

  static async UpdateComment(
    commentId: string,
    updatedContent: string
  ): Promise<boolean | null> {
    const res = await commentsCollection.updateOne(
      { _id: new ObjectId(commentId) },
      {
        $set: { content: updatedContent },
      }
    );
    return !!res.matchedCount;
  }

  static async deleteComment(commentId: string): Promise<boolean> {
    const res = await postsCollection.deleteOne({
      _id: new ObjectId(commentId),
    });
    return !!res.deletedCount;
  }
}
