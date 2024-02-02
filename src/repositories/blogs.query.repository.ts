import { blogsCollection } from "../db/db";
import {
  BlogOutputType,
  BlogPagination,
} from "../models/blogs/blog.output.model";
import { blogMapper } from "../models/blogs/mappers/blog-mapper";
import { ObjectId, SortDirection } from "mongodb";

type SortData = {
  searchNameTerm: string | null;
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};

export const blogsQueryRepository = {
  async getAllBlogs(
    sortData: SortData
  ): Promise<BlogPagination<BlogOutputType>> {
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
  },
  async getBlogById(id: string): Promise<BlogOutputType | null> {
    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });
    if (!blog) {
      return null;
    }
    return blogMapper(blog);
  },
};
