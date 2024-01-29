import { BlogInputType } from "../models/blogs/blog.input.model";
import { blogsCollection } from "../db/db";
import { BlogOutputType } from "../models/blogs/blog.output.model";
import { blogMapper } from "../models/blogs/mappers/blog-mapper";
import { ObjectId } from "mongodb";

export const blogsRepository = {
  async getAll(): Promise<BlogOutputType[]> {
    const blogs = await blogsCollection.find({}).toArray();
    return blogs.map(blogMapper);
  },
  async getBlogById(id: string): Promise<BlogOutputType | null> {
    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });
    if (!blog) {
      return null;
    }
    return blogMapper(blog);
  },
  async createBlog(createdBlog: BlogInputType): Promise<BlogOutputType> {
    const createdAt = new Date().toISOString();
    const res = await blogsCollection.insertOne(createdBlog);
    return { id: res.insertedId.toString(), ...createdBlog, createdAt };
  },
  async updateBlog(id: string, updateData: BlogInputType): Promise<boolean> {
    const res = await blogsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: updateData.name,
          description: updateData.description,
          websiteUrl: updateData.websiteUrl,
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
