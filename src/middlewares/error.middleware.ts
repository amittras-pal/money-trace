import { ErrorRequestHandler, NextFunction, Request } from "express";
import { getEnv } from "../env/config";
import { TypedResponse } from "../types/requests";

const errorHandler: ErrorRequestHandler = (
  err: Error | undefined,
  _req: Request,
  res: TypedResponse,
  _next: NextFunction
) => {
  const { NODE_ENV } = getEnv();
  res.json({
    message: err?.message ?? "",
    stack: NODE_ENV === "development" ? err?.stack : null,
  });
};

export default errorHandler;
