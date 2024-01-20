/*
import { NextFunction, Request, Response } from "express";

export const nameValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

};
*/

import { body } from "express-validator";

export const nameValidator = body("name")
  .isString()
  .trim()
  .withMessage("Incorrect Name - Name must be a string")
  .isLength({ min: 1, max: 15 })
  .withMessage("Incorrect Name - min 1 character & max 15 character");

export const descriptionValidator = body("description")
  .isString()
  .trim()
  .withMessage("Incorrect description - must be a string")
  .isLength({ min: 1, max: 500 })
  .withMessage("Incorrect description - min 1 character & max 500 character");

export const webSiteUrlValidator = body("name")
  .isString()
  .trim()
  .withMessage("Incorrect description - must be a string")
  .isLength({ min: 1, max: 500 })
  .withMessage("Incorrect description - min 1 character & max 500 character")
  .isURL()
  .withMessage("Incorrect URL - must be correct URL addres");
