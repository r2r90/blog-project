import { postMapper } from "../../types/posts/mappers/post-mapper";
import { ObjectId } from "mongodb";
import {
  NewestLikesInputType,
  PostCreateInputType,
  PostUpdateInputType,
} from "../../types/posts/post-input-model/post.input.model";
import { PostsModel } from "../../db/schemas/posts-schema";
import { BlogsModel } from "../../db/schemas/blogs-schema";
import { LikeStatus } from "../../db/schemas/comments-schema";
import { UserQueryRepository } from "../user-repositories/user.query.repository";

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

    return { id: res.id, ...createdPost };
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
    const userAlreadyLiked = post.usersLiked?.find(
      (like) => like.likedUserId === userId
    );

    const user = await UserQueryRepository.getUserById(userId);

    if (!user) return;

    const likedUserInfo = {
      likedUserId: userId,
      likesStatus: newLikeStatus,
    };

    const likeDetails: NewestLikesInputType = {
      addedAt: new Date().toISOString(),
      userId: userId,
      login: user.login,
    };

    if (!userAlreadyLiked) {
      post.usersLiked?.push(likedUserInfo);
      post.extendedLikesInfo.newestLikes.push(likeDetails);

      newLikeStatus === LikeStatus.Like
        ? post.extendedLikesInfo.likesCount++
        : post.extendedLikesInfo.dislikesCount++;
    }

    if (userAlreadyLiked && userAlreadyLiked.likesStatus !== LikeStatus.None) {
      if (userAlreadyLiked.likesStatus === newLikeStatus) return false;
      if (
        userAlreadyLiked.likesStatus === LikeStatus.Like &&
        newLikeStatus === LikeStatus.Dislike
      ) {
        post.extendedLikesInfo.likesCount -= 1;
        post.extendedLikesInfo.dislikesCount += 1;
        userAlreadyLiked.likesStatus = newLikeStatus;
      }

      if (
        userAlreadyLiked.likesStatus === LikeStatus.Dislike &&
        newLikeStatus === LikeStatus.Like
      ) {
        post.extendedLikesInfo.likesCount += 1;
        post.extendedLikesInfo.dislikesCount -= 1;
        userAlreadyLiked.likesStatus = newLikeStatus;
      }

      if (newLikeStatus === LikeStatus.None) {
        userAlreadyLiked.likesStatus === LikeStatus.Like
          ? post.extendedLikesInfo.likesCount--
          : post.extendedLikesInfo.dislikesCount--;
      }

      post.usersLiked = post.usersLiked?.filter(
        (like) => like.likedUserId !== userId
      );
    }

    console.log(post);

    await post.save();
    return true;
  }

  static async deletePost(id: string) {
    const res = await PostsModel.deleteOne({ _id: new ObjectId(id) });
    return !!res.deletedCount;
  }
}
