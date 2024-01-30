import { configDotenv } from "dotenv";
import { MongoClient } from "mongodb";
import { PostsDbType } from "../models/db/db-model";
import { BlogDbType } from "../models/blogs/db/blog-db";

configDotenv();

const uri = process.env.MONGO_URI || "mongodb://localhost:27017";

const client = new MongoClient(uri);
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
