import { body } from "express-validator";
import { inputModelValidationMiddleware } from "../inputValidation/input-model-validation-middleware";

const loginValidator = body("login")
  .trim()
  .isString()
  .not()
  .isNumeric()
  .isLength({ min: 3, max: 10 })
  .matches(/^[a-zA-Z0-9_-]*$/)
  .withMessage("Incorrect login");
const emailValidator = body("email")
  .trim()
  .isEmail()
  .withMessage("Incorrect email");
const passwordValidator = body("password")
  .trim()
  .isString()
  .isLength({ min: 6, max: 20 })
  .matches(/^[a-zA-Z0-9_-]*$/)
  .withMessage("Incorrect login");

export const userValidator = () => {
  return [
    loginValidator,
    emailValidator,
    passwordValidator,
    inputModelValidationMiddleware,
  ];
};
