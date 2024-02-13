import { postMapper } from "../../models/posts/mappers/post-mapper";
import { ObjectId, SortDirection } from "mongodb";
import {
  PostOutputType,
  PostPagination,
} from "../../models/posts/post.output.model";
import { postsCollection } from "../../db/db";

export type PostSortData = {
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};

export class PostQueryRepository {
  static async getAllPosts(
    sortData: PostSortData
  ): Promise<PostPagination<PostOutputType>> {
    const { sortBy, sortDirection, pageNumber, pageSize } = sortData;

    const posts = await postsCollection
      .find({})
      .sort(sortBy, sortDirection)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();
    const totalCount = await postsCollection.countDocuments({});
    const pagesCount = Math.ceil(totalCount / pageSize);
    return {
      pagesCount,
      pageSize,
      page: pageNumber,
      totalCount,
      items: posts.map(postMapper),
    };
  }

  static async getPostById(id: string) {
    const post = await postsCollection.findOne({ _id: new ObjectId(id) });
    if (!post) {
      return null;
    }
    return postMapper(post);
  }

  static async getAllPostsByBlogId(
    blogId: string,
    sortData: PostSortData
  ): Promise<PostPagination<PostOutputType>> {
    const { sortBy, sortDirection, pageNumber, pageSize } = sortData;
    const postsCount = await postsCollection.countDocuments({ blogId });
    const posts = await postsCollection
      .find({ blogId })
      .sort(sortBy, sortDirection)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    return {
      pagesCount: Math.ceil(postsCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: postsCount,
      items: posts.map(postMapper),
    };
  }
}