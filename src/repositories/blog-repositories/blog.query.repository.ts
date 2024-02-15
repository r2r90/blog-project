import { blogsCollection } from "../../db/db";
import {
  BlogOutputType,
  BlogPaginationType,
} from "../../types/blogs/output-model/blog.output.model";
import { blogMapper } from "../../types/blogs/mappers/blog-mapper";
import { ObjectId } from "mongodb";
import { BlogSortData } from "../../types/blogs/blog-input-model/blog.query.input.model";

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
          $regex: searchNameTerm,
          $options: "i",
        },
      };
    }

    const blogs = await blogsCollection
      .find(filter)
      .sort(sortBy, sortDirection)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();
    const totalCount = await blogsCollection.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);
    return {
      pageSize,
      page: pageNumber,
      pagesCount,
      totalCount,
      items: blogs.map(blogMapper),
    };
  }

  static async getBlogById(id: string): Promise<BlogOutputType | null> {
    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });
    return blog ? blogMapper(blog) : null;
  }
}
