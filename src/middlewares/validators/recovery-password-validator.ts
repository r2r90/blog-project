import { body } from "express-validator";
import { inputModelValidationMiddleware } from "../inputValidation/input-model-validation-middleware";
import { Error } from "mongoose";
import jwt from "jsonwebtoken";
import { appConfig } from "../../config/config";

const newPasswordValidator = body("newPassword")
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage("Incorrect password");

const recoveryCodeValidator = body("recoveryCode").custom(
  async (recoveryCode: string) => {
    if (!recoveryCode) {
      throw new Error("Missing Recovery Code");
    }
    const isValid = jwt.verify(recoveryCode, appConfig.EMAIL_RECOVERY_SECRET);
    if (!isValid) {
      throw new Error("Invalid Recovery Code!");
    }
  }
);

export const newPasswordValidations = () => {
  return [
    newPasswordValidator,
    recoveryCodeValidator,
    inputModelValidationMiddleware,
  ];
};
