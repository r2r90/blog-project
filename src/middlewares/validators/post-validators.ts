import { body } from "express-validator";
import { inputModelValidationMiddleware } from "../inputValidation/input-model-validation-middleware";
import { BlogQueryRepository } from "../../repositories/blog.query.repository";

const titleValidator = body("title")
  .isString()
  .trim()
  .withMessage("Incorrect Title - Title must be a string")
  .isLength({ min: 1, max: 30 })
  .withMessage("Incorrect Title - min 1 character & max 30 character");

const shortDescriptionValidator = body("shortDescription")
  .isString()
  .trim()
  .withMessage("Incorrect short description - must be a string")
  .isLength({ min: 1, max: 100 })
  .withMessage("Incorrect description - min 1 character & max 500 character");

const contentValidator = body("content")
  .isString()
  .trim()
  .withMessage("Incorrect short description - must be a string")
  .isLength({ min: 1, max: 1000 })
  .withMessage("Incorrect description - min 1 character & max 500 character");

const blogIdValidator = body("blogId").custom(async (value) => {
  const blog = await BlogQueryRepository.getBlogById(value);
  if (!blog) {
    throw Error("Incorrect Blog ID");
  }
  return true;
});

export const createPostValidation = () => [
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  blogIdValidator,
  inputModelValidationMiddleware,
];

export const createPostFromBlogValidation = () => [
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  inputModelValidationMiddleware,
];
