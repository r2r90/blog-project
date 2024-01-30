import { Request } from "express";

export type ParamType = {
  id: string;
};

export type RequestType = Request<{}, {}, {}, {}>;

export type RequestWithBody<B> = Request<{}, {}, B>;

export type RequestWithParamAndBody<P, B> = Request<P, {}, B>;
