import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import { blogsRoute } from "./routes/blog-router";
import { testingRouter } from "./routes/testing-router";
import { postRouter } from "./routes/post-router";
import { userRouter } from "./routes/user-router";
import { authRouter } from "./routes/auth-router";
import { commentsRouter } from "./routes/comments-router";
import { sessionRouter } from "./routes/session-router";

export const app = express();

app.use(express.json());
app.use(cookieParser());

const welcomeText =
  "This is a backend application with NO FRONT-END. To understand how the application works, I suggest you visit my GitHub page (until I find the time to upload the complete Swagger documentation here). It’s essentially a backend for a blog where users can create their accounts, create blogs, log in, write posts, leave comments on posts, like and dislike posts, and so on. This is a learning project to understand the basics of Express.js with a lot of CRUD operations, DDD architecture, working with MongoDB, authentication, and other features. So if you're interested, you can check out my GitHub and test the routes via Postman.";

app.get("/", (req: Request, res: Response) => {
  res.send(welcomeText);
});

app.use("/blogs", blogsRoute);
app.use("/posts", postRouter);
app.use("/comments", commentsRouter);
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/security/devices", sessionRouter);
app.use("/testing", testingRouter);
