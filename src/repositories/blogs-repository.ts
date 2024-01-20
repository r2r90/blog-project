import {db} from "../db/db";

export const blogsRepository = {
    findBlogById(id: string) {
        return db.blogsDb.find(b => b.id === id)
    }
}