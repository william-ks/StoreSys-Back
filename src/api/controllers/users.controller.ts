import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { prisma } from "../../services/prisma";

interface newUser {
  name?: string;
  email?: string;
  password?: string;
}

class userControllers {
  public async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password, role } = req.body;

    try {
      // validate if email already exists
      const emailExists = await prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (emailExists) {
        return res
          .status(400)
          .json({ message: "Esse e-mail já está em nosso banco de dados." });
      }

      // encrypt password
      const encryptedPass = await bcrypt.hash(password, 10);

      let newUser: any = {
        name,
        email,
        password: encryptedPass,
      };

      if (role) {
        if (role === "USER" || role === "ADMIN") {
          newUser.role = role;
        }
      }

      await prisma.user.create({
        data: {
          ...newUser,
        },
      });

      return res.status(201).end();
    } catch (e) {
      return res.status(500).json({ message: "Erro interno no servidor" });
    }
  }

  public async readAll(req: Request, res: Response): Promise<Response> {
    try {
      const users = await prisma.user.findMany({
        orderBy: {
          id: "asc",
        },
      });

      return res.status(200).json(users);
    } catch (e) {
      return res.status(500).json({ message: "Erro interno no servidor" });
    }
  }

  public async readSelf(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: id as number,
        },
      });

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      const { password: _, ...userData } = user;

      return res.status(200).json(userData);
    } catch (e) {
      return res.status(500).json({ message: "Erro interno no servidor." });
    }
  }

  public async readOne(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    if (!Number(id)) {
      return res.status(400).json({ message: "Parâmetro inválido." });
    }

    try {
      const user = await prisma.user.findFirst({
        where: {
          id: Number(id),
        },
      });

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      const { password: _, ...userData } = user;

      return res.status(200).json(userData);
    } catch (e) {
      return res.status(500).json({ message: "Erro interno no servidor." });
    }
  }

  public async updateSelf(req: Request, res: Response): Promise<Response> {
    const { name, email, password }: newUser = req.body;
    const { id: userId } = req.user;

    let newUser: newUser = {};

    if (!name && !email && !password) {
      return res
        .status(400)
        .json({ message: "Sem dados para serem atualizados." });
    }

    if (name) {
      newUser.name = name;
    }

    if (password) {
      newUser.password = password;
    }

    try {
      if (email) {
        const emailAlreadyExists = await prisma.user.findFirst({
          where: {
            email,
            NOT: {
              id: userId as number,
            },
          },
        });

        if (emailAlreadyExists) {
          return res.status(400).json({ message: "Esse e-mail já existe." });
        }

        newUser.email = email;
      }

      const user = await prisma.user.findFirst({
        where: {
          id: userId as number,
        },
      });

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      await prisma.user.update({
        data: { ...newUser },
        where: {
          id: userId as number,
        },
      });
      return res.status(204).end();
    } catch (e) {
      return res.status(500).json({ message: "Erro interno no servidor." });
    }
  }

  public async updateOther(req: Request, res: Response): Promise<Response> {
    const { name, email } = req.body;
    const { id: userId } = req.params;

    if (!Number(userId)) {
      return res.status(400).json({ message: "Parâmetro inválido." });
    }

    try {
      const user = await prisma.user.findFirst({
        where: {
          id: Number(userId),
        },
      });

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      let newUser: newUser = {};

      if (!name && !email) {
        return res
          .status(400)
          .json({ message: "Sem dados para serem atualizados." });
      }

      if (name) {
        newUser.name = name;
      }

      if (email) {
        const emailAlreadyExists = await prisma.user.findFirst({
          where: {
            email,
            NOT: {
              id: Number(userId),
            },
          },
        });

        if (emailAlreadyExists) {
          return res.status(400).json({ message: "Esse e-mail já existe." });
        }

        newUser.email = email;
      }

      await prisma.user.update({
        data: { ...newUser },
        where: {
          id: Number(userId),
        },
      });
      return res.status(204).end();
    } catch (e) {
      return res.status(500).json({ message: "Erro interno no servidor." });
    }
  }
}

export default new userControllers();
