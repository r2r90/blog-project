import { BlogRepository } from "../repositories/blog.repository";
import { BlogQueryRepository } from "../repositories/blog.query.repository";
import { BlogSortData } from "../models/blogs/blog-input-model/blog.query.input.model";
import {
  BlogOutputType,
  BlogPagination,
} from "../models/blogs/output-model/blog.output.model";
import {
  BlogCreateInputType,
  BlogUpdateInputType,
} from "../models/blogs/blog-input-model/blog.input.model";

export class BlogService {
  static async getAllBlogs(
    sortData: BlogSortData
  ): Promise<BlogPagination<BlogOutputType>> {
    return await BlogQueryRepository.getAllBlogs(sortData);
  }

  static async getBlogById(id: string) {
    return await BlogQueryRepository.getBlogById(id);
  }

  static async createBlog({
    name,
    websiteUrl,
    description,
  }: BlogCreateInputType) {
    const createdAt = new Date().toISOString();
    const blog = {
      name,
      websiteUrl,
      description,
      isMembership: false,
      createdAt,
    };
    return await BlogRepository.createBlog(blog);
  }

  static async updateBlog({
    id,
    name,
    websiteUrl,
    description,
  }: BlogUpdateInputType & { id: string }) {
    return await BlogRepository.updateBlog({
      id,
      name,
      websiteUrl,
      description,
    });
  }

  static async deleteBlog(id: string): Promise<boolean | null> {
    return await BlogRepository.deleteBlog(id);
  }
}
