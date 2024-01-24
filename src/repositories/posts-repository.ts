import { db } from "../db/db";
import { blogsRepository } from "./blogs-repository";
import { PostInputType } from "../models/posts/input";
import { PostType } from "../models/posts/output";

const findPost = (id: string) => {
  return db.postsDb.find((p) => p.id === id);
};

export const postsRepository = {
  getAll() {
    return db.postsDb;
  },

  getPostById(id: string) {
    const post = findPost(id);
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

  updatePost(postToUpdate: PostType, updates: PostInputType) {
    postToUpdate.title = updates.title;
    postToUpdate.shortDescription = updates.shortDescription;
    postToUpdate.content = updates.content;

    return postToUpdate;
  },
  deletePost(id: string) {
    const post = db.postsDb.find((p) => p.id === id);
    if (post) {
      db.postsDb = db.postsDb.filter((p) => p.id !== post.id);
      return true;
    }
    return false;
  },
};
