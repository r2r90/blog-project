import {
  PostQueryRepository,
  PostSortData,
} from "../repositories/post-repositories/post.query.repository";
import { CreatePostFromBlogInputModel } from "../types/posts/post-input-model/create.post.from.blog.input.model";
import { PostOutputType } from "../types/posts/post.output.model";
import { PostRepository } from "../repositories/post-repositories/post.repository";
import {
  PostCreateInputType,
  PostUpdateInputType,
} from "../types/posts/post-input-model/post.input.model";
import { BlogService } from "./blog-service";
import { CommentViewModel } from "../types/comments/comments.output.model";
import { UserQueryRepository } from "../repositories/user-repositories/user.query.repository";
import { CommentRepository } from "../repositories/comment-repositories/comment.repository";
import { BlogQueryRepository } from "../repositories/blog-repositories/blog.query.repository";
import { PostDbType } from "../db/schemas/posts-schema";
import { LikeStatus } from "../db/schemas/comments-schema";

export class PostService {
  static async getAllPostsByBlogId(
    blogId: string,
    sortData: PostSortData,
    userId: string | undefined
  ) {
    return await PostQueryRepository.getAllPostsByBlogId(
      blogId,
      sortData,
      userId
    );
  }

  static async getPostById(
    id: string,
    userId: string | undefined
  ): Promise<PostOutputType | null> {
    return await PostQueryRepository.getPostById(id, userId);
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
    const blog = await BlogQueryRepository.getBlogById(blogId);
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
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatus.None,
        newestLikes: [],
      },
      usersLiked: [],
    };

    const createdPost = await PostRepository.createPost(newPost);

    if (!createdPost) {
      return null;
    }
    const createdPostId = createdPost.id;
    const post = await PostQueryRepository.getPostById(createdPostId, "");
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

  static async addCommentToPost(
    postId: string,
    content: string,
    userId: string
  ): Promise<CommentViewModel | null> {
    const post = await PostRepository.getPostById(postId, userId);
    const user = await UserQueryRepository.getUserById(userId);
    if (!post || !user) return null;

    return CommentRepository.createComment({
      postId,
      content,
      createdAt: new Date().toISOString(),
      commentatorInfo: {
        userId,
        userLogin: user.login,
      },
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        usersLiked: [],
      },
    });
  }
}
