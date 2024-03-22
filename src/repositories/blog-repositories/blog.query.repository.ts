import {
  BlogOutputType,
  BlogPaginationType,
} from "../../models/blogs/output-model/blog.output.model";
import { blogMapper } from "../../models/blogs/mappers/blog-mapper";
import { ObjectId } from "mongodb";
import { BlogSortData } from "../../models/blogs/blog-input-model/blog.query.input.model";
import { BlogsModel } from "../../db/schemas/blogs-schema";
import { BlogDbType } from "../../models/db-types";

export class BlogQueryRepository {
  static async getAllBlogs(
    sortData: BlogSortData
  ): Promise<BlogPaginationType<BlogOutputType>> {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } =
      sortData;
    let filter = {};
    if (searchNameTerm) {
      filter = {
        name: {
          $regex: new RegExp(searchNameTerm, "i"),
        },
      };
    }

    const blogs = await BlogsModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);
    const totalCount = await BlogsModel.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);
    return {
      pageSize,
      page: pageNumber,
      pagesCount,
      totalCount,
      items: blogs.map(blogMapper),
    };
  }

  static async getBlogById(id: string): Promise<BlogDbType | null> {
    const blog = await BlogsModel.findOne({ _id: new ObjectId(id) });
    if (!blog) {
      return null;
    }
    return blog;
  }
}
