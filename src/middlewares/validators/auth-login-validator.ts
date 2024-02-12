import { body } from "express-validator";
import { inputModelValidationMiddleware } from "../inputValidation/input-model-validation-middleware";

const loginOrEmailValidator = body("loginOrEmail")
  .trim()
  .isString()
  .not()
  .isNumeric()
  .isLength({ min: 3, max: 30 })
  .withMessage("Login or email is incorrect");
const passwordValidator = body("password")
  .trim()
  .isString()
  .isLength({ min: 6, max: 30 })
  .withMessage("Incorrect password");

export const loginOrEmailValidation = () => {
  return [
    loginOrEmailValidator,
    passwordValidator,
    inputModelValidationMiddleware,
  ];
};
