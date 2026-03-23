import { ErrorRequestHandler, NextFunction, Request } from "express";
import { getEnv } from "../env/config";
import { ApiError } from "../types/errors";
import { TypedResponse } from "../types/requests";

const errorHandler: ErrorRequestHandler = (
  err: Error | undefined,
  _req: Request,
  res: TypedResponse,
  _next: NextFunction,
) => {
  const { NODE_ENV } = getEnv();
  const code = err instanceof ApiError ? err.code : undefined;

  res.json({
    message: err?.message ?? "",
    code,
    stack: NODE_ENV === "development" ? err?.stack : null,
  });
};

export default errorHandler;
