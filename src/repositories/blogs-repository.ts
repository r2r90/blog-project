import { BlogInputType } from "../models/blogs/input";
import { db } from "../db/db";
import { BlogType } from "../models/blogs/output";

export const blogsRepository = {
  getAll() {
    return db.blogsDb;
  },
  getBlogById(id: string) {
    const blog = db.blogsDb.find((b) => b.id === id);
    if (!blog) {
      return false;
    }
    return blog;
  },
  createBlog(createdBlog: BlogType) {
    db.blogsDb.push(createdBlog);
    return createdBlog;
  },
  updateBlog(id: string, updates: BlogInputType) {
    const blogToUpdate = db.blogsDb.find((b) => b.id === id);
    if (!blogToUpdate) {
      return null; // Return null instead of false for clarity
    }

    // Apply updates if provided

    blogToUpdate.name = updates.name;
    blogToUpdate.description = updates.description;
    blogToUpdate.websiteUrl = updates.websiteUrl;

    return blogToUpdate;
  },
  deleteBlog(id: string) {
    const blog = db.blogsDb.find((b) => b.id === id);
    if (blog) {
      db.blogsDb = db.blogsDb.filter((b) => b.id !== blog.id);
      return true;
    }
    return false;
  },
};
