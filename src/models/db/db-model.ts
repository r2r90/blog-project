import { BlogType } from "../blogs/output";
import { PostType } from "../posts/output";

export type DBType = {
  blogsDb: BlogsDbType;
  postsDb: PostsDbType;
};

export type BlogsDbType = BlogType[];
export type PostsDbType = PostType[];
