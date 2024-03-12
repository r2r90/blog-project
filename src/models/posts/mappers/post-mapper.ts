import { WithId } from "mongodb";
import { PostOutputType } from "../post.output.model";
import { PostDbType } from "../../db-types";

export const postMapper = (post: WithId<PostDbType>): PostOutputType => {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
  };
};
