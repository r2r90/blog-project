import express from "express";
import cookieParser from "cookie-parser";
import { blogsRoute } from "./routes/blog-router";
import { testingRouter } from "./routes/testing-router";
import { postRouter } from "./routes/post-router";
import { userRouter } from "./routes/user-router";
import { authRouter } from "./routes/auth-router";
import { commentsRouter } from "./routes/comments-router";
import { sessionRouter } from "./routes/session-router";
import path from "path";

export const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../src/public/index.html"));
});

app.use("/blogs", blogsRoute);
app.use("/posts", postRouter);
app.use("/comments", commentsRouter);
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/security/devices", sessionRouter);
app.use("/testing", testingRouter);
