import { prisma } from "../../services/prisma";
import { Request, Response, NextFunction } from "express";

const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user;
  const actualUser = await prisma.user.findFirst({
    where: {
      id: id as number,
    },
  });

  if (!actualUser || actualUser.role !== "ADMIN") {
    return res.status(403).json({ message: "Acesso negado." });
  }

  req.user.role = actualUser.role;
  next();
};

export default adminAuth;
