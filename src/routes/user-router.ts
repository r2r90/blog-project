import { Response, Router } from "express";
import { HTTP_RESPONSE_CODES, RequestWithQuery } from "../models/common/common";
import { UserQueryRepository } from "../repositories/user-repositories/user.query.repository";
import { UserQueryInputModel } from "../models/users/users-input/user.query.input.model";

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
