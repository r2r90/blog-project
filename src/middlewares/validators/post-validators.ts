import { body } from "express-validator";
import { blogsRepository } from "../../repositories/blogs-repository";
import { inputValidationMiddleware } from "../inputValidation/input-validation-middleware";

/*
  PostInputModel{
  title*	string
  maxLength: 30
  shortDescription*	string
  maxLength: 100
  content*	string
  maxLength: 1000
  blogId*	string
}
*/

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

const blogIdValidator = body("blogId").custom((value) => {
  const blog = blogsRepository.findBlogById(value);
  if (!blog) {
    throw Error("Incorrect Blog ID");
  }
  return true;
});

export const postValidation = () => [
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  blogIdValidator,
  inputValidationMiddleware,
];
