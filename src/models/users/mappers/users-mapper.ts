import { WithId } from "mongodb";
import { UserDbType } from "../user-db";
import { UserOutputType } from "../users-output/user.output.model";

export const userMapper = (user: WithId<UserDbType>): UserOutputType => {
  return {
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
  };
};
