import { Response, Router } from "express";
import {
  HTTP_RESPONSE_CODES,
  ParamType,
  RequestWithBody,
  RequestWithParam,
  RequestWithQuery,
} from "../types/common";
import { UserQueryRepository } from "../repositories/user-repositories/user.query.repository";
import { UserQueryInputModel } from "../types/users/users-input/user.query.input.model";
import { UserCreateInputType } from "../types/users/users-input/user.input.model";
import { UserService } from "../services/user-service";
import { basicAuthMiddleware } from "../middlewares/auth/basic-auth-middleware";
import { userValidator } from "../middlewares/validators/user-validator";
import { add } from "date-fns";

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
  basicAuthMiddleware,
  userValidator(),
  async (req: RequestWithBody<UserCreateInputType>, res: Response) => {
    const { login, password, email }: UserCreateInputType = req.body;

    const newUserCreateData = {
      login,
      password,
      email,
      emailConfirmation: {
        confirmationCode: "",
        expirationDate: add(new Date(), {
          seconds: 1,
        }),
        isConfirmed: true,
      },
    };

    let createdUser = await UserService.createUser(newUserCreateData);
    createdUser
      ? res.status(HTTP_RESPONSE_CODES.CREATED).send(createdUser)
      : res.send(HTTP_RESPONSE_CODES.NOT_FOUND);
  }
);

userRouter.delete(
  "/:id",
  basicAuthMiddleware,
  async (req: RequestWithParam<ParamType>, res: Response) => {
    const id = req.params.id;

    const isUserDeleted = await UserService.deleteUser(id);

    isUserDeleted
      ? res
          .status(HTTP_RESPONSE_CODES.NO_CONTENT)
          .send("User successfully deleted")
      : res.sendStatus(HTTP_RESPONSE_CODES.NOT_FOUND);
  }
);
