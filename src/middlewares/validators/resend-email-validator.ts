import { body } from "express-validator";
import { UserQueryRepository } from "../../repositories/user-repositories/user.query.repository";
import { inputModelValidationMiddleware } from "../inputValidation/input-model-validation-middleware";

const emailValidator = body("email")
  .trim()
  .isEmail()
  .custom(async (email: string) => {
    const user = await UserQueryRepository.getUserByLoginOrEmail(email);
    if (!user || user.emailConfirmation?.isConfirmed) {
      throw Error("Incorrect Email or profile already confirmed");
    }

    return true;
  })
  .withMessage("Incorrect Email address");

export const resendEmailValidator = () => [
  emailValidator,
  inputModelValidationMiddleware,
];
