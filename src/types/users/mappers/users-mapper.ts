import { WithId } from "mongodb";
import { UserViewModel } from "../users-output/user.output.model";
import { UserDbType } from "../../../db/schemas/users-schema";

export const userMapper = (user: WithId<UserDbType>): UserViewModel => {
  return {
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
  };
};
