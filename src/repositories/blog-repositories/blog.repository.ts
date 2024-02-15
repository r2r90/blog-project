import { BlogUpdateInputType } from "../../types/blogs/blog-input-model/blog.input.model";
import { blogsCollection } from "../../db/db";
import { BlogOutputType } from "../../types/blogs/output-model/blog.output.model";
import { ObjectId } from "mongodb";
import { BlogDbType } from "../../types/db-types";

export class BlogRepository {
  static async getBlogById(id: string): Promise<BlogDbType | null> {
    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });
    if (!blog) {
      return null;
    }
    return blog;
  }

  static async createBlog(blog: BlogDbType): Promise<BlogOutputType> {
    const createdBlog = await blogsCollection.insertOne({ ...blog });
    return { ...blog, id: createdBlog.insertedId.toString() };
  }

  static async updateBlog(
    blogUpdateData: BlogUpdateInputType & { id: string }
  ): Promise<boolean> {
    const res = await blogsCollection.updateOne(
      { _id: new ObjectId(blogUpdateData.id) },
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
