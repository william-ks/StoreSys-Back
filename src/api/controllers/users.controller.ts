import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { prisma } from "../../services/prisma";

interface newUserUpdateSelf {
  name?: string;
  email?: string;
  password?: string;
  hierarchy_id?: number;
}

class userControllers {
  public async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password, hierarchy_id } = req.body;
    const { user: actualUser } = req;

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
        hierarchy_id
      };

      if (hierarchy_id > 4 || hierarchy_id < 1) {
        return res.status(400).json({ message: "Hierquia inválida" });
      }

      if (hierarchy_id === 1 && actualUser.hierarchy_id !== 1) {
        console.log(actualUser.hierarchy_id)
        return res.status(400).json({ message: "Você não pode criar um usuário com cargo de hierarquia maior que o seu." })
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
          name: "asc",
        },
        select: {
          id: true,
          email: true,
          name: true,
          hierarchy: {
            select: {
              name: true
            }
          },
        }
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
        include: {
          hierarchy: {
            select: {
              name: true
            }
          }
        }
      });

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      const { password: _, hierarchy_id: __, ...userData } = user;

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
        include: {
          hierarchy: {
            select: {
              name: true
            }
          }
        }
      });

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      const { password: _, hierarchy_id: __, ...userData } = user;

      return res.status(200).json(userData);
    } catch (e) {
      return res.status(500).json({ message: "Erro interno no servidor." });
    }
  }

  public async updateSelf(req: Request, res: Response): Promise<Response> {
    const { name, email, password }: any = req.body;
    const { id: userId } = req.user;

    let newUser: any = {};

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
    const { name, email, hierarchy_id } = req.body;
    const { user: actualUser } = req;
    const { id: updatedUserId } = req.params;

    if (!Number(updatedUserId)) {
      return res.status(400).json({ message: "Parâmetro inválido." });
    }

    try {
      const user = await prisma.user.findFirst({
        where: {
          id: Number(updatedUserId),
        },
        include: {
          hierarchy: true
        }
      });

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      if (!name && !email && !hierarchy_id) {
        return res
          .status(400)
          .json({ message: "Sem dados para serem atualizados." });
      }

      let newUser: newUserUpdateSelf = {};

      // validating hierarchy_id and if user can do this changes
      if (hierarchy_id) {
        if (!Number(hierarchy_id) || hierarchy_id > 4 || hierarchy_id < 1) return res.status(400).json({ message: 'Cargo de hierarquia inválido.' });

        if (!actualUser || !actualUser.hierarchy_id) return res.status(500).json({ message: "O ocorreu um erro interno no servidor. FAKE" })

        if (actualUser.hierarchy_id >= user.hierarchy_id) {
          return res.status(403).json({
            message: "Você não tem permissão para alterar o cargo da hierarquia deste usuário."
          });
        }

        if (hierarchy_id === 1 && actualUser.hierarchy_id !== 1) {
          return res.status(403).json({
            message: "Você não tem permissão para alterar o cargo da hierarquia deste usuário para um cargo maior que o seu."
          });
        }

        newUser.hierarchy_id = hierarchy_id;
      }

      if (name) {
        newUser.name = name;
      }

      if (email) {
        const emailAlreadyExists = await prisma.user.findFirst({
          where: {
            email,
            NOT: {
              id: Number(updatedUserId),
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
          id: Number(updatedUserId),
        },
      });
      return res.status(204).end();
    } catch (e) {
      return res.status(500).json({ message: "Erro interno no servidor." });
    }
  }

  public async desableProfile(req: Request, res: Response): Promise<Response> {
    return res.status(200).end();
  }
}

export default new userControllers();
