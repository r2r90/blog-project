import { configDotenv } from "dotenv";
import { MongoClient } from "mongodb";
import { BlogDbType, PostDbType, UserDbType } from "../types/db-types";
import { appConfig } from "../config/config";

configDotenv();
const url = appConfig.MONGO_URL;

if (!url) {
  throw new Error(`! Url doesn't found`);
}
const client = new MongoClient(url);
const database = client.db("blog-app");

export const blogsCollection = database.collection<BlogDbType>("blogs");
export const postsCollection = database.collection<PostDbType>("posts");
export const usersCollection = database.collection<UserDbType>("users");

export const runDb = async () => {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB ");
  } catch (e) {
    console.log(`ERROR: ${e}`);
    await client.close();
  }
};
