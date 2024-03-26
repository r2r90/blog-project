import { body } from "express-validator";
import { inputModelValidationMiddleware } from "../inputValidation/input-model-validation-middleware";

const newPasswordValidator = body("password")
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage("Incorrect password");

export const newPasswordValidation = () => {
  return [newPasswordValidator, inputModelValidationMiddleware];
};
