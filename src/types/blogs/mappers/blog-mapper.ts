import { WithId } from "mongodb";

import { BlogOutputType } from "../output-model/blog.output.model";
import { BlogDbType } from "../../../db/schemas/blogs-schema";

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
