import { WithId } from "mongodb";
import { UserOutputType } from "../users-output/user.output.model";
import { UserDbType } from "../../db-types";

export const userMapper = (user: WithId<UserDbType>): UserOutputType => {
  return {
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
  };
};
