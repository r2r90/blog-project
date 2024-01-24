import { body } from "express-validator";
import { inputValidationMiddleware } from "../inputValidation/input-validation-middleware";

export const nameValidator = body("name")
  .isString()

  .withMessage("Incorrect Name - Name must be a string")
  .trim()
  .isLength({ min: 1, max: 15 })
  .withMessage("Incorrect Name - min 1 character & max 15 character");

export const descriptionValidator = body("description")
  .isString()
  .withMessage("Incorrect description - must be a string")
  .trim()
  .isLength({ min: 1, max: 500 })
  .withMessage("Incorrect description - min 1 character & max 500 character");

export const webSiteUrlValidator = body("name")
  .isString()
  .withMessage("Incorrect description - must be a string")
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage("Incorrect description - min 1 character & max 500 character")
  .matches(
    "^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$"
  )
  .withMessage("Incorrect URL - must be correct URL address");

export const blogValidation = () => [
  nameValidator,
  descriptionValidator,
  webSiteUrlValidator,
  inputValidationMiddleware,
];
