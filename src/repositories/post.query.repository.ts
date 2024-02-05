import { postsCollection } from "../db/db";
import { postMapper } from "../models/posts/mappers/post-mapper";
import { ObjectId, SortDirection } from "mongodb";
import {
  PostOutputType,
  PostPagination,
} from "../models/posts/post.output.model";

type SortData = {
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};

export class PostQueryRepository {
  static async getAllPosts(
    sortData: SortData
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
}
