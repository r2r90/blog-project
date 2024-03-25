import { Request, Response, Router } from "express";
import { BlogsModel } from "../db/schemas/blogs-schema";
import { PostsModel } from "../db/schemas/posts-schema";
import { UsersModel } from "../db/schemas/users-schema";
import { CommentsModel } from "../db/schemas/comments-schema";
import { RequestGuardModel } from "../db/schemas/user-request-limit";
import { SessionDbModel } from "../db/schemas/session-schema";

export const testingRouter = Router();

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
  await BlogsModel.deleteMany({});
  await PostsModel.deleteMany({});
  await UsersModel.deleteMany({});
  await CommentsModel.deleteMany({});
  await RequestGuardModel.deleteMany({});
  await SessionDbModel.deleteMany({});
  res.sendStatus(204);
});
