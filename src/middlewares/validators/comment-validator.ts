import { body } from "express-validator";
import { inputModelValidationMiddleware } from "../inputValidation/input-model-validation-middleware";

const commentBodyValidator = body("content")
  .trim()
  .isString()
  .isLength({ min: 20, max: 300 })
  .withMessage("Incorrect comment");

export const commentValidator = () => {
  return [commentBodyValidator, inputModelValidationMiddleware];
};
