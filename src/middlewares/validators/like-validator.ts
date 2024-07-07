import { body } from "express-validator";
import { inputModelValidationMiddleware } from "../inputValidation/input-model-validation-middleware";

const likeStatusValidation = body("likeStatus")
  .isString()
  .isIn(["Like", "Dislike", "None"])
  .withMessage("Incorrect likeStatus");

export const likeStatusValidator = () => {
  return [likeStatusValidation, inputModelValidationMiddleware];
};
