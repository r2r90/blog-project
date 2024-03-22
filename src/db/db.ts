import { configDotenv } from "dotenv";
import { MongoClient } from "mongodb";
import {
  BlogDbType,
  CommentDbType,
  DeviceConnectDbType,
  DeviceRequestDBType,
  PostDbType,
  RefreshTokenDbType,
  UserDbType,
} from "../models/db-types";
import { appConfig } from "../config/config";
import mongoose from "mongoose";

configDotenv();

const dbName = "home-works";
const url = appConfig.MONGO_URL || `mongodb://0.0.0.0:2017/${dbName}`;

if (!url) {
  throw new Error(`! Url doesn't found`);
}
const client = new MongoClient(url);
const database = client.db("blog-app");

export const blogsCollection = database.collection<BlogDbType>("blogs");
export const postsCollection = database.collection<PostDbType>("posts");
export const usersCollection = database.collection<UserDbType>("users");
export const commentsCollection =
  database.collection<CommentDbType>("comments");
export const blackListCollection =
  database.collection<RefreshTokenDbType>("refresh-tokens");

export const deviceRequestsCollection =
  database.collection<DeviceRequestDBType>("device-requests");

export const deviceConnectCollection =
  database.collection<DeviceConnectDbType>("device-connects");

export const runDb = async () => {
  try {
    await mongoose.connect(url);
    console.log("Connected successfully to MongoDB ");
  } catch (e) {
    console.log(`ERROR: ${e}`);
    await client.close();
  }
};
