import { WithId } from "mongodb";
import { PostOutputType } from "../post.output.model";
import { PostDbType } from "../../../db/schemas/posts-schema";
import { LikeStatus } from "../../../db/schemas/comments-schema";

export const postMapper = (
  post: WithId<PostDbType>,
  userId: string | undefined
): PostOutputType => {
  const sortedNewestLikes = post.extendedLikesInfo.newestLikes
    .sort(
      (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    )
    .slice(0, 3);

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
        post.usersLiked?.find((like) => like.likedUserId === userId)
          ?.likesStatus || LikeStatus.None,
      newestLikes: sortedNewestLikes,
    },
  };
};
