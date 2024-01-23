import { Request, Response, Router } from "express";
import { blogsRepository } from "../repositories/blogs-repository";
import { authMiddleware } from "../middlewares/auth/auth-middleware";
import { blogValidation } from "../middlewares/validators/blog-validators";

export const blogsRouter = Router();

blogsRouter.get("/", (req: Request, res: Response) => {
  const blogs = blogsRepository.getAll();
  res.send(blogs);
});

blogsRouter.get("/:id", (req: Request, res: Response) => {
  const foundedBlog = blogsRepository.findBlogById(req.params.id);
  res.status(200).send(foundedBlog);
});

blogsRouter.post(
  "/",
  authMiddleware,
  blogValidation,
  (req: Request, res: Response) => {
    const { name, description, websiteUrl } = req.body;
    const newBlog = {
      id: new Date().toDateString(),
      name,
      description,
      websiteUrl,
    };

    const createdBlog = blogsRepository.createBlog(newBlog);

    res.send(createdBlog);
  }
);
