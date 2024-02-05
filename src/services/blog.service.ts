import { PostDbType } from "../models/posts/post-db";
import { postRepository } from "../repositories/post.repository";
import { CreatePostFromBlogInputModel } from "../models/blogs/blog-input-model/create.post.from.blog.input.model";
import { PostOutputType } from "../models/posts/post.output.model";
import { BlogRepository } from "../repositories/blog.repository";
import { PostQueryRepository } from "../repositories/post.query.repository";

export class BlogService {
  static async createPost() {}
  static async createPostToBlog(
    blogId: string,
    createPostModel: CreatePostFromBlogInputModel
  ): Promise<PostOutputType | null> {
    const { title, content, shortDescription } = createPostModel;
    const blog = await BlogRepository.getBlogById(blogId);
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
    const post = await PostQueryRepository.getPostById(createdPostId);
    if (!post) {
      return null;
    }
    return post;
  }
}
