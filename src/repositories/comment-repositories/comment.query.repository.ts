import { commentsCollection } from "../../db/db";
import { ObjectId } from "mongodb";
import { CommentSortData } from "../../types/comments/comment.query.input";
import { commentMapper } from "../../types/comments/commentMapper";
import { CommentsGetResponse } from "../../types/comments/comments.output.model";

export class CommentQueryRepository {
  static async getAllCommentsByPostId(
    postId: string,
    sortData: CommentSortData
  ): Promise<CommentsGetResponse> {
    const { pageNumber, pageSize, sortBy, sortDirection } = sortData;
    const comments = await commentsCollection
      .find({ postId: postId })
      .sort(sortBy, sortDirection)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    const commentsCount = await commentsCollection.countDocuments({
      postId: postId,
    });

    return {
      pagesCount: Math.ceil(commentsCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: commentsCount,
      items: comments.map(commentMapper),
    };
  }

  static async getCommentById(commentId: string) {
    const comment = await commentsCollection.findOne({
      _id: new ObjectId(commentId),
    });

    return comment ? commentMapper(comment) : null;
  }
}
