import { body } from "express-validator";
import { inputModelValidationMiddleware } from "../inputValidation/input-model-validation-middleware";

const emailValidator = body("email")
  .trim()
  .isEmail()
  .withMessage("Incorrect email");
export const emailValidation = () => {
  return [emailValidator, inputModelValidationMiddleware];
};
