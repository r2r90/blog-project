import {
  PostQueryRepository,
  PostSortData,
} from "../repositories/post-repositories/post.query.repository";
import { CreatePostFromBlogInputModel } from "../types/posts/post-input-model/create.post.from.blog.input.model";
import { PostOutputType } from "../types/posts/post.output.model";
import { BlogRepository } from "../repositories/blog-repositories/blog.repository";
import { PostRepository } from "../repositories/post-repositories/post.repository";
import {
  PostCreateInputType,
  PostUpdateInputType,
} from "../types/posts/post-input-model/post.input.model";
import { BlogService } from "./blog.service";
import { PostDbType } from "../types/db-types";

export class PostService {
  static async getAllPostsByBlogId(blogId: string, sortData: PostSortData) {
    return await PostQueryRepository.getAllPostsByBlogId(blogId, sortData);
  }

  static async getPostById(id: string): Promise<PostOutputType | null> {
    return await PostQueryRepository.getPostById(id);
  }

  static async createPost(newPostData: PostCreateInputType) {
    const blog = await BlogService.getBlogById(newPostData.blogId);
    const createdAt = new Date().toISOString();
    const post = { ...newPostData, blogName: blog!.name, createdAt };

    return await PostRepository.createPost(post);
  }

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
    const createdPost = await PostRepository.createPost(newPost);
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

  static async updatePost(
    id: string,
    postUpdateData: PostUpdateInputType
  ): Promise<boolean | null> {
    return await PostRepository.updatePost(id, postUpdateData);
  }

  static async deletePost(id: string): Promise<boolean | null> {
    return await PostRepository.deletePost(id);
  }
}
