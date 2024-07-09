import { ObjectId } from "mongodb";
import { CommentSortData } from "../../types/comments/comment.query.input";
import { commentMapper } from "../../types/comments/commentMapper";
import {
  CommentsGetResponse,
  CommentViewModel,
} from "../../types/comments/comments.output.model";
import { CommentsModel } from "../../db/schemas/comments-schema";

export class CommentQueryRepository {
  static async getAllCommentsByPostId(
    postId: string,
    sortData: CommentSortData,
    userId?: string | null
  ): Promise<CommentsGetResponse> {
    const { pageNumber, pageSize, sortBy, sortDirection } = sortData;
    const comments = await CommentsModel.find({ postId: postId })
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const commentsCount = await CommentsModel.countDocuments({
      postId: postId,
    });

    return {
      pagesCount: Math.ceil(commentsCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: commentsCount,
      items: comments.map((comment) => commentMapper(comment, userId)),
    };
  }

  static async getCommentById(
    commentId: string,
    userId?: string | null
  ): Promise<CommentViewModel | null> {
    const comment = await CommentsModel.findOne({
      _id: new ObjectId(commentId),
    });

    return comment ? commentMapper(comment, userId) : null;
  }
}
