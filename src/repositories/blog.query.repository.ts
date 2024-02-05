import { blogsCollection, postsCollection } from "../db/db";
import {
  BlogOutputType,
  BlogPagination,
} from "../models/blogs/output-model/blog.output.model";
import { blogMapper } from "../models/blogs/mappers/blog-mapper";
import { ObjectId, SortDirection } from "mongodb";
import { postMapper } from "../models/posts/mappers/post-mapper";
import { PostSortData } from "./post.query.repository";

type BlogSortData = {
  searchNameTerm: string | null;
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};

export class BlogQueryRepository {
  static async getAllBlogs(
    sortData: BlogSortData
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
  }

  static async getBlogById(id: string): Promise<BlogOutputType | null> {
    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });
    if (!blog) {
      return null;
    }
    return blogMapper(blog);
  }

  static async getPostsByBlogId(blogId: string, sortData: PostSortData) {
    const { sortBy, sortDirection, pageNumber, pageSize } = sortData;

    const posts = await postsCollection
      .find({ _id: new ObjectId(blogId) })
      .sort(sortBy, sortDirection)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();
    const totalCount = await postsCollection.countDocuments({
      _id: new ObjectId(blogId),
    });
    const pagesCount = Math.ceil(totalCount / pageSize);
    return {
      pagesCount,
      pageSize,
      page: pageNumber,
      totalCount,
      items: posts.map(postMapper),
    };
  }
}
