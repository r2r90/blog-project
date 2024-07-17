import { postMapper } from "../../types/posts/mappers/post-mapper";
import { ObjectId, SortDirection } from "mongodb";
import {
  PostOutputType,
  PostPagination,
} from "../../types/posts/post.output.model";
import { PostsModel } from "../../db/schemas/posts-schema";

export type PostSortData = {
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};

export class PostQueryRepository {
  static async getAllPosts(
    sortData: PostSortData,
    userId: string | undefined
  ): Promise<PostPagination<PostOutputType>> {
    const { sortBy, sortDirection, pageNumber, pageSize } = sortData;

    const posts = await PostsModel.find({})
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const totalCount = await PostsModel.countDocuments(posts);
    const pagesCount = Math.ceil(totalCount / pageSize);
    return {
      pagesCount,
      pageSize,
      page: pageNumber,
      totalCount,
      items: posts.map((post) => postMapper(post, userId)),
    };
  }

  static async getPostById(id: string, userId: any) {
    const post = await PostsModel.findOne({ _id: new ObjectId(id) });
    if (!post) {
      return null;
    }
    return postMapper(post, userId);
  }

  static async getAllPostsByBlogId(
    blogId: string,
    sortData: PostSortData,
    userId: string | undefined
  ): Promise<PostPagination<PostOutputType>> {
    const { sortBy, sortDirection, pageNumber, pageSize } = sortData;

    const postsCount = await PostsModel.countDocuments({ blogId });
    const posts = await PostsModel.find({ blogId })
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    return {
      pagesCount: Math.ceil(postsCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: postsCount,
      items: posts.map((post) => postMapper(post, userId)),
    };
  }
}
