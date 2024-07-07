import { LikeStatus } from "../db/schemas/comments-schema";
import { CommentRepository } from "../repositories/comment-repositories/comment.repository";

export class LikeService {
  static async likeComment(
    commentId: string,
    isAuthor: boolean,
    likeStatus: LikeStatus
  ) {
    if (likeStatus === "None") return null;
    if (likeStatus === "Like") {
      const res = await CommentRepository.LikeComment(commentId);
    }
    if (likeStatus === "Like") {
      const res = await CommentRepository.DislikeComment(commentId);
    }
    return null;
  }
}
