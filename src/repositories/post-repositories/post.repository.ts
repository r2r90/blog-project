import { postMapper } from "../../models/posts/mappers/post-mapper";
import { ObjectId } from "mongodb";
import {
  PostCreateInputType,
  PostUpdateInputType,
} from "../../models/posts/post-input-model/post.input.model";
import { PostsModel } from "../../db/schemas/posts-schema";
import { BlogsModel } from "../../db/schemas/blogs-schema";

export class PostRepository {
  static async getPostById(id: string) {
    const post = await PostsModel.findOne({ _id: new ObjectId(id) });
    if (!post) {
      return null;
    }

    return postMapper(post);
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

  static async deletePost(id: string) {
    const res = await PostsModel.deleteOne({ _id: new ObjectId(id) });
    return !!res.deletedCount;
  }
}
