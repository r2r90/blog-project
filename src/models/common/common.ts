import { Request, Response } from "express";

export type ParamType = {
  id: string;
};

export type RequestType = Request<{}, {}, {}, {}>;

export type RequestWithParam<P> = Request<P, {}, {}, {}>;

export type RequestWithBody<B> = Request<{}, {}, B>;

export type RequestWithParamAndBody<P, B> = Request<P, {}, B>;

export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>;
export type RequestWithParamAndQuery<P, Q> = Request<P, {}, {}, Q>;
export type ResponseType<T> = Response<T, {}>;

export const HTTP_RESPONSE_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
};

export type ErrorType = {
  errorMessages: ErrorMessageType[];
};

export type ErrorMessageType = {
  message: string;
  field: string;
};
