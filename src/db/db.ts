import { configDotenv } from "dotenv";
import { MongoClient } from "mongodb";
import { appConfig } from "../config/config";
import mongoose from "mongoose";

configDotenv();

const dbName = "home-works";
const url = appConfig.MONGO_URL || `mongodb://0.0.0.0:2017/${dbName}`;

if (!url) {
  throw new Error(`! Url doesn't found`);
}
const client = new MongoClient(url);

export const runDb = async () => {
  try {
    await mongoose.connect(url);
    console.log("Connected successfully to MongoDB ");
  } catch (e) {
    console.log(`ERROR: ${e}`);
    await client.close();
  }
};
