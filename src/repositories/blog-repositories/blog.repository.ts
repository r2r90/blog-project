import { BlogUpdateInputType } from "../../models/blogs/blog-input-model/blog.input.model";
import { BlogOutputType } from "../../models/blogs/output-model/blog.output.model";
import { ObjectId } from "mongodb";
import { BlogDbType } from "../../models/db-types";
import { BlogsModel } from "../../db/schemas/blogs-schema";

export class BlogRepository {
  static async createBlog(blog: BlogDbType): Promise<BlogOutputType> {
    const createdBlog = await BlogsModel.create({ ...blog });
    return { ...blog, id: createdBlog.id };
  }

  static async updateBlog(
    blogUpdateData: BlogUpdateInputType & { id: string }
  ): Promise<boolean> {
    const res = await BlogsModel.updateOne(
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
    const res = await BlogsModel.deleteOne({ _id: new ObjectId(id) });
    return !!res.deletedCount;
  }
}
