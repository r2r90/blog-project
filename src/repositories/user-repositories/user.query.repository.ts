import { UserSortData } from "../../models/users/users-input/user.query.input.model";
import {
  UserPaginationType,
  UserViewModel,
} from "../../models/users/users-output/user.output.model";
import { userMapper } from "../../models/users/mappers/users-mapper";
import { UserDbType } from "../../models/db-types";
import { WithId } from "mongodb";
import { UsersModel } from "../../db/schemas/users-schema";

export class UserQueryRepository {
  static async getAllUsers(
    sortData: UserSortData
  ): Promise<UserPaginationType<UserViewModel>> {
    const {
      searchEmailTerm,
      searchLoginTerm,
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
    } = sortData;

    let filter = {};

    let filterOptions = [];

    if (searchLoginTerm) {
      filterOptions.push({
        login: {
          $regex: searchLoginTerm,
          $options: "i",
        },
      });
    }

    if (searchEmailTerm) {
      filterOptions.push({
        email: {
          $regex: searchEmailTerm,
          $options: "i",
        },
      });
    }

    if (filterOptions.length) {
      filter = { $or: filterOptions };
    }

    const users = await UsersModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);
    const totalCount = await UsersModel.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);
    return {
      pageSize,
      page: pageNumber,
      pagesCount,
      totalCount,
      items: users.map(userMapper),
    };
  }

  static async getUserByLoginOrEmail(
    loginOrEmail: string
  ): Promise<WithId<UserDbType> | null> {
    const foundUser = await UsersModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });

    return foundUser ? foundUser : null;
  }

  static async getUserByConfirmationCode(
    emailConfirmationCode: string
  ): Promise<WithId<UserDbType> | null> {
    const foundUser = await UsersModel.findOne({
      "emailConfirmation.confirmationCode": emailConfirmationCode,
    });

    return foundUser ? foundUser : null;
  }

  static async getUserById(id: string): Promise<WithId<UserDbType> | null> {
    try {
      return await UsersModel.findById(id); // If user exists, returns user document, otherwise null
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error; // Rethrow the error to be handled elsewhere
    }
  }
}
