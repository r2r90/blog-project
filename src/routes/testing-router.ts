import { Request, Response, Router } from "express";
import { db } from "../db/db";

export const testingRouter = Router();

testingRouter.delete("/all-data", (req: Request, res: Response) => {
  db.blogsDb.length = 0;
  res.status(204);
});
