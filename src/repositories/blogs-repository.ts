import { BlogType, db } from "../db/db";

export const blogsRepository = {
  getAll() {
    return db.blogsDb;
  },
  findBlogById(id: string) {
    return db.blogsDb.find((b) => b.id === id);
  },
  createBlog(createdBlog: BlogType) {
    db.blogsDb.push(createdBlog);
    return createdBlog;
  },
};
