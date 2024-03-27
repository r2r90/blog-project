import mongoose from "mongoose";

const uri = process.env.MONGO_URI ?? "mongodb://localhost:27017";
const dbName = process.env.MONGO_DB_NAME ?? "blogs-app";
const uriComplete = `${uri}/${dbName}?authSource=admin`;

export const runDb = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected successfully to MongoDB database");
  } catch (e) {
    console.error(`${e}`);
    await mongoose.disconnect();
  }
};
