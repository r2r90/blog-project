import express, { Request, Response } from "express";
import { blogsRoute } from "./routes/blog-router";
import { testingRouter } from "./routes/testing-router";
import { postRouter } from "./routes/post-router";
import { userRouter } from "./routes/user-router";
import { authRouter } from "./routes/auth-router";
import { commentsRouter } from "./routes/comments-router";

export const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Blogs App OK!");
});

app.use("/blogs", blogsRoute);
app.use("/posts", postRouter);
app.use("/comments", commentsRouter);
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/testing", testingRouter);
