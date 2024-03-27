import { configDotenv } from "dotenv";
import { appConfig } from "../config/config";
import mongoose from "mongoose";

configDotenv();

const dbName = "blog-project";
const url = appConfig.MONGO_URL || `mongodb://0.0.0.0:2017/${dbName}`;

if (!url) {
  throw new Error(`! Url doesn't found`);
}
// const client = new MongoClient(url);

export const runDb = async () => {
  try {
    console.log(url);
    await mongoose.connect(url);
    console.log("Connected successfully to MongoDB ");
  } catch (e) {
    console.log(`ERROR: ${e}`);
    await mongoose.disconnect();
  }
};
