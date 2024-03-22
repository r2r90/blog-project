import { Request, Response, Router } from "express";
import {
  blackListCollection,
  commentsCollection,
  deviceConnectCollection,
} from "../db/db";
import { BlogsModel } from "../db/schemas/blogs-schema";
import { PostsModel } from "../db/schemas/posts-schema";
import { UsersModel } from "../db/schemas/users-schema";

export const testingRouter = Router();

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
  await BlogsModel.deleteMany({});
  await PostsModel.deleteMany({});
  await UsersModel.deleteMany({});
  await blackListCollection.deleteMany({});
  await commentsCollection.deleteMany({});
  await deviceConnectCollection.deleteMany({});
  await deviceConnectCollection.deleteMany({});
  res.sendStatus(204);
});
