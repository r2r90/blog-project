import { body } from "express-validator";
import { UserQueryRepository } from "../../repositories/user-repositories/user.query.repository";
import { inputModelValidationMiddleware } from "../inputValidation/input-model-validation-middleware";

const registerLoginValidator = body("login")
  .trim()
  .isLength({ min: 3, max: 10 })
  .matches(/^[a-zA-Z0-9_-]*$/)
  .custom(async (login: string) => {
    const user = await UserQueryRepository.getUserByLoginOrEmail(login);
    if (user) {
      throw Error("Login already exist.");
    }
    return true;
  })
  .withMessage("Incorrect login");

const registerEmailValidator = body("email")
  .trim()
  .isEmail()
  .custom(async (email: string) => {
    const user = await UserQueryRepository.getUserByLoginOrEmail(email);
    if (user) {
      throw Error("Email already exist.");
    }
    return true;
  })
  .withMessage("Incorrect email");

const registerPasswordValidator = body("password")
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage("Incorrect password");

export const registerValidator = () => {
  return [
    registerLoginValidator,
    registerEmailValidator,
    registerPasswordValidator,
    inputModelValidationMiddleware,
  ];
};
