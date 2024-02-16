import { body } from "express-validator";
import { inputModelValidationMiddleware } from "../inputValidation/input-model-validation-middleware";

const content = body("content")
  .trim()
  .isString()
  .not()
  .isNumeric()
  .isLength({ min: 20, max: 300 })
  .withMessage("Incorrect comment");

export const commentValidator = () => {
  return [content];
};
