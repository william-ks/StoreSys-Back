import { NextFunction, Request, Response } from "express";

export const handleError = async (
  error: Error,
  req: Request,
  res: Response,
  NextFunction: NextFunction,
) => {
  console.log(error);
  const { message, code } = error;

  return res.status(code || 500).json({
    status: "error",
    message: message || "Unexpected server error.",
  });
};
