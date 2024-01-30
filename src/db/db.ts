import { configDotenv } from "dotenv";
import { MongoClient } from "mongodb";
import { PostsDbType } from "../models/db/db-model";
import { BlogDbType } from "../models/blogs/blog-db";

configDotenv();
const url = process.env.MONGO_URL;

console.log(url);

if (!url) {
  throw new Error(` ! Url doesn't found`);
}
const client = new MongoClient(url);
const database = client.db("blog-app");

export const blogsCollection = database.collection<BlogDbType>("blogs");
export const postsCollection = database.collection<PostsDbType>("posts");

export const runDb = async () => {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB ");
  } catch (e) {
    console.log(`ERROR: ${e}`);
    await client.close();
  }
};
