import { UserSortData } from "../../models/users/users-input/user.query.input.model";
import {
  UserOutputType,
  UserPaginationType,
} from "../../models/users/users-output/user.output.model";
import { usersCollection } from "../../db/db";
import { userMapper } from "../../models/users/mappers/users-mapper";
import { UserDbType } from "../../models/db-types";
import { WithId } from "mongodb";

export class UserQueryRepository {
  static async getAllUsers(
    sortData: UserSortData
  ): Promise<UserPaginationType<UserOutputType>> {
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

    const users = await usersCollection
      .find(filter)
      .sort(sortBy, sortDirection)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray();
    const totalCount = await usersCollection.countDocuments(filter);
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
    const foundUser = await usersCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });

    return foundUser ? foundUser : null;
  }
}
