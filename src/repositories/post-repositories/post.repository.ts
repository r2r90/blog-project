import { blogsCollection, postsCollection } from "../../db/db";
import { postMapper } from "../../types/posts/mappers/post-mapper";
import { ObjectId } from "mongodb";
import {
  PostCreateInputType,
  PostUpdateInputType,
} from "../../types/posts/post-input-model/post.input.model";

export class PostRepository {
  static async getPostById(id: string) {
    const post = await postsCollection.findOne({ _id: new ObjectId(id) });
    if (!post) {
      return null;
    }

    return postMapper(post);
  }

  static async createPost(postCreateInputData: PostCreateInputType) {
    const blog = await blogsCollection.findOne({
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

    const res = await postsCollection.insertOne({ ...createdPost });
    return { id: res.insertedId.toString(), ...createdPost };
  }

  static async updatePost(id: string, postUpdateData: PostUpdateInputType) {
    const res = await postsCollection.updateOne(
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
    const res = await postsCollection.deleteOne({ _id: new ObjectId(id) });
    return !!res.deletedCount;
  }
}
