import { db } from "../db/db";
import { blogsRepository } from "./blogs-repository";
import { PostInputType } from "../models/posts/input";

export const postsRepository = {
  getAll() {
    return db.postsDb;
  },

  getPostById(id: string) {
    const post = db.postsDb.find((p) => p.id === id);
    if (!post) {
      return false;
    }
    return post;
  },
  createPost(inputValues: PostInputType) {
    const { title, shortDescription, content, blogId } = inputValues;
    const blog = blogsRepository.getBlogById(blogId);
    if (!blog) {
      return;
    } else {
      let createdPost = {
        id: Date.now().toString(),
        title,
        shortDescription,
        content,
        blogId,
        blogName: blog.name,
      };

      db.postsDb.push(createdPost);
      return createdPost;
    }
  },

  updatePost(id: string, updates: PostInputType) {
    const postToUpdate = db.postsDb.find((p) => p.id === id);
    if (!postToUpdate) {
      return;
    } else {
      postToUpdate.title = updates.title;
      postToUpdate.shortDescription = updates.shortDescription;
      postToUpdate.content = updates.content;

      return postToUpdate;
    }
  },
  deletePost(id: string) {
    const postToDelete = db.postsDb.find((p) => p.id === id);
    if (postToDelete) {
      db.postsDb = db.postsDb.filter((p) => p.id !== postToDelete.id);
      return true;
    }
    return false;
  },
};
