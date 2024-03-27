import { configDotenv } from "dotenv";
import { appConfig } from "../config/config";
import mongoose from "mongoose";

configDotenv();

const url = appConfig.MONGO_URL;

if (!url) {
  throw new Error(`! Url doesn't found`);
}

export const runDb = async () => {
  try {
    await mongoose.connect(url);
    console.log("Connected successfully to MongoDB ");
  } catch (e) {
    console.log(`ERROR: ${e}`);
    await mongoose.disconnect();
  }
};
