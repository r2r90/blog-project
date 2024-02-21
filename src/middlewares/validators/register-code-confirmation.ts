import { body } from "express-validator";
import { UserQueryRepository } from "../../repositories/user-repositories/user.query.repository";
import { inputModelValidationMiddleware } from "../inputValidation/input-model-validation-middleware";

const codeValidator = body("code")
  .isString()
  .custom(async (code: string) => {
    const user = await UserQueryRepository.getUserByConfirmationCode(code);
    if (!user) {
      throw Error("Confirmation code is wrong");
    }
    if (user.emailConfirmation?.isConfirmed) {
      throw Error("User already confirmed");
    }
    if (user.emailConfirmation?.expirationDate < new Date()) {
      throw Error("Confirmation code is expired");
    }

    return true;
  })
  .withMessage("Incorrect code!");

export const registerCodeConfirmation = () => [
  codeValidator,
  inputModelValidationMiddleware,
];
