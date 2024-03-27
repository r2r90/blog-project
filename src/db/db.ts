import { configDotenv } from "dotenv";
import mongoose from "mongoose";

configDotenv();

const url = "mongodb://127.0.0.1:27017/blog-project";

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
