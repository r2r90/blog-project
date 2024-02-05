import { PostDbType } from "../models/posts/post-db";
import { postRepository } from "../repositories/post.repository";
import { postQueryRepository } from "../repositories/post.query.repository";
import { blogRepository } from "../repositories/blog.repository";
import { CreatePostFromBlogInputModel } from "../models/blogs/input-model/create.post.from.blog.input.model";
import { PostOutputType } from "../models/posts/post.output.model";

export class BlogService {
  static async createPostToBlog(
    blogId: string,
    createPostModel: CreatePostFromBlogInputModel
  ): Promise<PostOutputType | null> {
    const { title, content, shortDescription } = createPostModel;
    const blog = await blogRepository.getBlogById(blogId);
    if (!blog) {
      return null;
    }
    const newPost: PostDbType = {
      title,
      content,
      shortDescription,
      blogId,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };
    const createdPost = await postRepository.createPost(newPost);
    if (!createdPost) {
      return null;
    }
    const createdPostId = createdPost.id;
    const post = await postQueryRepository.getPostById(createdPostId);
    if (!post) {
      return null;
    }

    return post;
  }
}
