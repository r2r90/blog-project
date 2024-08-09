import { postMapper } from "../../types/posts/mappers/post-mapper";
import { ObjectId } from "mongodb";
import {
  PostCreateInputType,
  PostUpdateInputType,
} from "../../types/posts/post-input-model/post.input.model";
import { PostsModel } from "../../db/schemas/posts-schema";
import { BlogsModel } from "../../db/schemas/blogs-schema";
import { LikeStatus } from "../../db/schemas/comments-schema";
import { UserQueryRepository } from "../user-repositories/user.query.repository";
import { UserLikedInfoType } from "../../types/posts/post.output.model";

export class PostRepository {
  static async getPostById(id: string, userId: string | undefined) {
    const post = await PostsModel.findOne({ _id: new ObjectId(id) });
    if (!post) {
      return null;
    }

    return postMapper(post, userId);
  }

  static async createPost(postCreateInputData: PostCreateInputType) {
    const blog = await BlogsModel.findOne({
      _id: new ObjectId(postCreateInputData.blogId),
    });

    if (!blog) {
      return null;
    }

    const createdAt = new Date().toISOString();
    const createdPost = {
      ...postCreateInputData,
      blogName: blog.name,
      createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatus.None,
        newestLikes: [],
      },
    };

    const res = await PostsModel.create({ ...createdPost });

    if (!res) return null;

    return {
      id: res.id,
      ...postCreateInputData,
      blogName: blog.name,
      createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatus.None,
        newestLikes: [],
      },
    };
  }

  static async updatePost(id: string, postUpdateData: PostUpdateInputType) {
    const res = await PostsModel.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: postUpdateData.title,
          shortDescription: postUpdateData.shortDescription,
          content: postUpdateData.content,
          blogId: postUpdateData.blogId,
        },
      }
    );

    return !!res.matchedCount;
  }

  static async likePost(
    postId: string,
    userId: string | undefined,
    newLikeStatus: LikeStatus
  ) {
    const post = await PostsModel.findOne({ _id: postId });
    if (!post || !userId) return false;
    const userAlreadyLiked = post.extendedLikesInfo.usersLiked?.find(
      (like: UserLikedInfoType) => like.userId === userId
    );

    const user = await UserQueryRepository.getUserById(userId);

    if (!user) return;

    const likedUserInfo = {
      userId,
      likedStatus: newLikeStatus,
      addedAt: new Date().toISOString(),
      login: user.login,
    };

    if (!userAlreadyLiked) {
      post.extendedLikesInfo.usersLiked?.push(likedUserInfo);

      newLikeStatus === LikeStatus.Like
        ? post.extendedLikesInfo.likesCount++
        : post.extendedLikesInfo.dislikesCount++;
    }

    if (userAlreadyLiked && userAlreadyLiked.likedStatus !== LikeStatus.None) {
      if (userAlreadyLiked.likedStatus === newLikeStatus) return false;
      if (
        userAlreadyLiked.likedStatus === LikeStatus.Like &&
        newLikeStatus === LikeStatus.Dislike
      ) {
        post.extendedLikesInfo.likesCount -= 1;
        post.extendedLikesInfo.dislikesCount += 1;
        userAlreadyLiked.likedStatus = newLikeStatus;
      }

      if (
        userAlreadyLiked.likedStatus === LikeStatus.Dislike &&
        newLikeStatus === LikeStatus.Like
      ) {
        post.extendedLikesInfo.likesCount += 1;
        post.extendedLikesInfo.dislikesCount -= 1;
        userAlreadyLiked.likedStatus = newLikeStatus;
      }

      if (newLikeStatus === LikeStatus.None) {
        userAlreadyLiked.likedStatus === LikeStatus.Like
          ? post.extendedLikesInfo.likesCount--
          : post.extendedLikesInfo.dislikesCount--;
        post.extendedLikesInfo.usersLiked =
          post.extendedLikesInfo.usersLiked?.filter(
            (like: UserLikedInfoType) => like.userId !== userId
          );
      }
    }

    await post.save();
    return true;
  }

  static async deletePost(id: string) {
    const res = await PostsModel.deleteOne({ _id: new ObjectId(id) });
    return !!res.deletedCount;
  }
}
