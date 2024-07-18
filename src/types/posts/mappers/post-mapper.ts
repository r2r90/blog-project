import { WithId } from "mongodb";
import { PostOutputType } from "../post.output.model";
import { PostDbType } from "../../../db/schemas/posts-schema";
import { LikeStatus } from "../../../db/schemas/comments-schema";

export const postMapper = (
  post: WithId<PostDbType>,
  userId: string | undefined
): PostOutputType => {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
    extendedLikesInfo: {
      likesCount: post.extendedLikesInfo.likesCount,
      dislikesCount: post.extendedLikesInfo.dislikesCount,
      myStatus:
        post.extendedLikesInfo.usersLiked?.find(
          (like) => like.userId === userId
        )?.likedStatus || LikeStatus.None,
      newestLikes:
        post.extendedLikesInfo.usersLiked
          ?.filter((like) => like.likedStatus === "Like")
          .sort(
            (a, b) =>
              new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
          )
          .map((like) => ({
            addedAt: like.addedAt,
            login: like.login,
            userId: like.userId,
          }))
          .slice(0, 3) || [],
    },
  };
};
