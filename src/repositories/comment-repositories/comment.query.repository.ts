import { commentsCollection } from "../../db/db";
import { ObjectId } from "mongodb";

export class CommentQueryRepository {
  static async getCommentById(commentId: string) {
    return await commentsCollection.findOne({
      _id: new ObjectId(commentId),
    });
  }
}
