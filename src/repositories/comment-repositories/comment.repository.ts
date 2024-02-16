import { CommentViewModel } from "../../types/comments/comments.output.model";
import { commentsCollection } from "../../db/db";
import { CommentDbType } from "../../types/db-types";

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
}
