import { Request, Response, Router } from "express";
import { blogsCollection, postsCollection } from "../db/db";

export const testingRouter = Router();

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
  console.log("Hello");
  await blogsCollection.deleteMany({});
  await postsCollection.deleteMany({});
  res.sendStatus(204);
});
