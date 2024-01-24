import { Request, Response, Router } from "express";
import { db } from "../db/db";

export const testingRouter = Router();

testingRouter.delete("/all-data", (req: Request, res: Response) => {
  db.blogsDb.length = 0;
  db.postsDb.length = 0;
  res.sendStatus(204);
});
