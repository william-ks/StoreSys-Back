import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).json({ message: "O token é obrigatório." });
  }

  if (!authorization.includes("Bearer")) {
    return res.status(400).json({ message: "O token é inválido." });
  }

  const token = authorization.split(" ")[1];

  try {
    const { id }: any = jwt.verify(token, process.env.JWT_PASS as string);

    req.user = { id };
    next();
  } catch (e) {
    return res.status(400).json({ message: "O token é inválido." });
  }
};

export default auth;
