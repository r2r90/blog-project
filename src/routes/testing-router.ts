import { Request, Response, Router } from "express";
import {
  blackListCollection,
  blogsCollection,
  commentsCollection,
  postsCollection,
  usersCollection,
} from "../db/db";

export const testingRouter = Router();

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
  await blogsCollection.deleteMany({});
  await postsCollection.deleteMany({});
  await usersCollection.deleteMany({});
  await commentsCollection.deleteMany({});
  await blackListCollection.deleteMany({});
  res.sendStatus(204);
});
