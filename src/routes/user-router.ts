import { Response, Router } from "express";
import {
  HTTP_RESPONSE_CODES,
  RequestWithBody,
  RequestWithQuery,
} from "../models/common/common";
import { UserQueryRepository } from "../repositories/user-repositories/user.query.repository";
import { UserQueryInputModel } from "../models/users/users-input/user.query.input.model";
import { UserCreateInputType } from "../models/users/users-input/user.input.model";
import { UserService } from "../services/user.service";
import { authMiddleware } from "../middlewares/auth/auth-middleware";
import { userValidator } from "../middlewares/validators/user-validator";

export const userRouter = Router();

userRouter.get(
  "/",
  async (req: RequestWithQuery<UserQueryInputModel>, res: Response) => {
    const sortData = {
      sortBy: req.query.sortBy ?? "createdAt",
      sortDirection: req.query.sortDirection ?? "desc",
      pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
      pageSize: req.query.pageSize ? +req.query.pageSize : 10,
      searchLoginTerm: req.query.searchLoginTerm ?? null,
      searchEmailTerm: req.query.searchEmailTerm ?? null,
    };
    const users = await UserQueryRepository.getAllUsers(sortData);
    res.send(users).status(HTTP_RESPONSE_CODES.SUCCESS);
  }
);

userRouter.post(
  "/",
  authMiddleware,
  userValidator,
  async (req: RequestWithBody<UserCreateInputType>, res: Response) => {
    const { login, password, email }: UserCreateInputType = req.body;

    const newUserCreateData = {
      login,
      password,
      email,
    };

    let createdUser = await UserService.createUser(newUserCreateData);
    createdUser
      ? res.status(HTTP_RESPONSE_CODES.CREATED).send(createdUser)
      : res.send(HTTP_RESPONSE_CODES.NOT_FOUND);
  }
);
