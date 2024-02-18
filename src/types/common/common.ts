import { Request, Response } from "express";
import { SortDirection } from "mongodb";

export type ParamType = {
  id: string;
};

export type IdType = {
  id: string;
};

export type JwtTokenType = {
  accessToken: string;
};

export type JwtVerifyType = {
  userId: string;
  iat: number;
  exp: number;
};

export type RequestType = Request<{}, {}, {}, {}>;

export type RequestWithParam<P> = Request<P, {}, {}, {}>;

export type RequestWithBody<B> = Request<{}, {}, B>;
export type RequestWithParamAndBody<P, B> = Request<P, {}, B>;
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>;
export type RequestWithParamAndQuery<P, Q> = Request<P, {}, {}, Q>;
export type RequestWithBodyAndUserId<B, U extends IdType> = Request<
  {},
  {},
  B,
  {},
  U
>;
export type RequestWithParamsAndBodyAndUserId<P, B, U extends IdType> = Request<
  P,
  {},
  B,
  {},
  U
>;

export type ResponseType<T> = Response<T, {}>;

export const HTTP_RESPONSE_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
};

export type ErrorType = {
  errorMessages: ErrorMessageType[];
};

export type ErrorMessageType = {
  message: string;
  field: string;
};

export type QueryInputModel = {
  sortBy?: string;
  sortDirection?: SortDirection;
  pageNumber?: string;
  pageSize?: string;
};
