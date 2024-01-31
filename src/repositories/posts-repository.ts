import { PostDbType } from "../models/posts/post-db";
import { blogsCollection, postsCollection } from "../db/db";
import { postMapper } from "../models/posts/mappers/post-mapper";
import { ObjectId } from "mongodb";
import {
  PostCreateInputType,
  PostUpdateInputType,
} from "../models/posts/post.input.model";

export const postsRepository = {
  async getAll(): Promise<PostDbType[]> {
    const posts = await postsCollection.find({}).toArray();
    return posts.map(postMapper);
  },

  async getPostById(id: string) {
    const post = await postsCollection.findOne({ _id: new ObjectId(id) });

    if (!post) {
      return null;
    }
    return postMapper(post);
  },
  async createPost(postCreateInputData: PostCreateInputType) {
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
  },

  async updatePost(id: string, postUpdateData: PostUpdateInputType) {
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
  },
  async deletePost(id: string) {
    const res = await postsCollection.deleteOne({ _id: new ObjectId(id) });
    return !!res.deletedCount;
  },
};
