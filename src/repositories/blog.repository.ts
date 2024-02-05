import {
  BlogCreateInputType,
  BlogUpdateInputType,
} from "../models/blogs/blog-input-model/blog.input.model";
import { blogsCollection } from "../db/db";
import { BlogOutputType } from "../models/blogs/output-model/blog.output.model";
import { ObjectId } from "mongodb";
import { BlogDbType } from "../models/blogs/blog-db";

export class BlogRepository {
  static async getBlogById(id: string): Promise<BlogDbType | null> {
    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });
    if (!blog) {
      return null;
    }
    return blog;
  }

  static async createBlog(
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
  }

  static async updateBlog(
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
  }

  static async deleteBlog(id: string): Promise<boolean | null> {
    const res = await blogsCollection.deleteOne({ _id: new ObjectId(id) });
    return !!res.deletedCount;
  }
}

/*export const blogRepository = {
  async getBlogById(id: string): Promise<BlogDbType | null> {
    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });
    if (!blog) {
      return null;
    }
    return blog;
  },
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
};*/
