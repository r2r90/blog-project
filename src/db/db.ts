import { configDotenv } from "dotenv";
import { MongoClient } from "mongodb";

configDotenv();

const uri = process.env.MONGO_URL ?? "mongodb://0.0.0.0:27017";
const client = new MongoClient(uri);

const db = client.db("blog-app");

export const runDb = async () => {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB ");
  } catch (e) {
    console.log(`ERROR: ${e}`);
    await client.close();
  }
};
