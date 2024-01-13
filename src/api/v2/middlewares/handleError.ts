import { NextFunction, Request, Response } from "express";

interface IError {
  message: string;
  code?: number;
}

export const handleError = async (
  error: Error,
  req: Request,
  res: Response,
  NextFunction: NextFunction,
) => {
  const { message, code }: IError = error;

  return res.status(code || 500).json({
    status: "error",
    message: message || "Unexpected server error.",
  });
};
