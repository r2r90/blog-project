import { Request, Response, Router } from "express";
import {
  blackListCollection,
  blogsCollection,
  commentsCollection,
  deviceConnectCollection,
  postsCollection,
  usersCollection,
} from "../db/db";

export const testingRouter = Router();

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
  await blogsCollection.deleteMany({});
  await postsCollection.deleteMany({});
  await usersCollection.deleteMany({});
  await blackListCollection.deleteMany({});
  await commentsCollection.deleteMany({});
  await deviceConnectCollection.deleteMany({});
  await deviceConnectCollection.deleteMany({});
  res.sendStatus(204);
});
