import { WithId } from "mongodb";
import { BlogDbType } from "../db/blog-db";
import { BlogOutputType } from "../blog.output.model";

export const blogMapper = (blog: WithId<BlogDbType>): BlogOutputType => {
  return {
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  };
};
