import {
  BlogCreateInputType,
  BlogUpdateInputType,
} from "../models/blogs/blog.input.model";
import { blogsCollection } from "../db/db";
import { BlogOutputType } from "../models/blogs/blog.output.model";
import { ObjectId } from "mongodb";

export const blogsRepository = {
  async createBlog(
    blogCreateInputData: BlogCreateInputType
  ): Promise<BlogOutputType> {
    const createdAt = new Date().toISOString();
    const createdBlog = {
      ...blogCreateInputData,
      isMembership: false,
      createdAt,
    };
    const res = await blogsCollection.insertOne({ ...createdBlog });

    return { id: res.insertedId.toString(), ...createdBlog };
  },
  async updateBlog(
    id: string,
    blogUpdateData: BlogUpdateInputType
  ): Promise<boolean> {
    const res = await blogsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: blogUpdateData.name,
          description: blogUpdateData.description,
          websiteUrl: blogUpdateData.websiteUrl,
        },
      }
    );

    return !!res.matchedCount;
  },
  async deleteBlog(id: string): Promise<boolean | null> {
    const res = await blogsCollection.deleteOne({ _id: new ObjectId(id) });
    return !!res.deletedCount;
  },
};
