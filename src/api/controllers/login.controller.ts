import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../../services/prisma";

const loginController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email, password } = req.body;

  try {
    const emailFound = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!emailFound) {
      return res.status(400).json({ message: "E-mail ou senha inválidos." });
    }

    const validPass = await bcrypt.compare(password, emailFound.password);

    if (!validPass) {
      return res.status(400).json({ message: "E-mail ou senha inválidos." });
    }

    const token = jwt.sign(
      { id: emailFound.id },
      process.env.JWT_PASS as string | "",
      {
        expiresIn: "8h",
      }
    );

    const { password: _, role: __, ...user } = emailFound;

    return res.status(200).json({ user, token });
  } catch (e) {
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
};

export default loginController;
