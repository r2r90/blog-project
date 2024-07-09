import { LikeStatus } from "../db/schemas/comments-schema";
import { CommentRepository } from "../repositories/comment-repositories/comment.repository";

export class LikeService {
  static async likeComment(
    commentId: string,
    likeStatus: LikeStatus,
    userId: string | null
  ) {
    const res = await CommentRepository.LikeComment(
      commentId,
      userId,
      likeStatus
    );
  }
}
