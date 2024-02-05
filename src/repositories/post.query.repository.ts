import { PostDbType } from "../models/posts/post-db";
import { postsCollection } from "../db/db";
import { postMapper } from "../models/posts/mappers/post-mapper";
import { ObjectId } from "mongodb";

export const postQueryRepository = {
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
};
