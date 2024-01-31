import { Request } from "express";

export type ParamType = {
  id: string;
};

export type RequestType = Request<{}, {}, {}, {}>;

export type RequestWithParams<P> = Request<P, {}, {}, {}>;

export type RequestWithBody<B> = Request<{}, {}, B>;

export type RequestWithParamsAndBody<P, B> = Request<P, {}, B>;

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
