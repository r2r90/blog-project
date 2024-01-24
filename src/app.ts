import express, { Request, Response } from "express";
import { blogsRouter } from "./routes/blog-router";
import { testingRouter } from "./routes/testing-router";
import { postsRouter } from "./routes/posts-router";

export const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Blogs App OK!");
});

app.use("/blogs", blogsRouter);
app.use("/posts", postsRouter);
app.use("/testing", testingRouter);
