import { Request, Response } from "express";
import { prisma } from "../../services/prisma";

class machineController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { title, credit, debit } = req.body;

    try {
      const alreadyExists = await prisma.machine.findFirst({
        where: {
          title,
          AND: {
            isDeleted: false,
          },
        },
      });

      if (alreadyExists) {
        return res
          .status(400)
          .json({ message: "Já existe uma maquina com esse nome." });
      }

      await prisma.machine.create({
        data: {
          title,
          credit,
          debit,
        },
      });

      return res.status(201).end();
    } catch (e) {
      return res.status(500).json({ message: "Erro interno no servidor." });
    }
  }

  public async read(req: Request, res: Response): Promise<Response> {
    try {
      const machines = await prisma.machine.findMany({
        where: {
          isDeleted: false,
        },
        orderBy: {
          id: "asc",
        },
      });

      return res.status(200).json(machines);
    } catch (e) {
      return res.status(500).json({ message: "Erro interno no servidor." });
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { title, credit, debit } = req.body;
    const { id } = req.params;

    if (!title && !credit && debit) {
      return res
        .status(400)
        .json({ message: "Sem dados a serem atualizados." });
    }

    if (!Number(id)) {
      return res.status(400).json({ message: "Parâmetro inválido." });
    }

    try {
      const validId = await prisma.machine.findFirst({
        where: {
          id: Number(id),
          AND: {
            isDeleted: false,
          },
        },
      });

      if (!validId) {
        return res.status(404).json({ message: "Maquina não encontrada." });
      }

      const alreadyExists = await prisma.machine.findFirst({
        where: {
          title,
          NOT: {
            id: Number(id),
          },
        },
      });

      if (alreadyExists) {
        return res
          .status(404)
          .json({ message: "Já existe uma maquina com esse nome." });
      }

      let dataToUpdate: any = [];

      if (title) {
        dataToUpdate.title = title;
      }

      if (credit) {
        dataToUpdate.credit = credit;
      }

      if (debit) {
        dataToUpdate.debit = debit;
      }

      await prisma.machine.update({
        data: {
          ...dataToUpdate,
        },
        where: {
          id: Number(id),
        },
      });

      return res.status(204).end();
    } catch (e) {
      return res.status(500).json({ message: "Erro interno no servidor." });
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      await prisma.machine.update({
        data: {
          isDeleted: true,
        },
        where: {
          id: Number(id),
        },
      });
      return res.status(204).end();
    } catch (e) {
      return res.status(500).json({ message: "Erro interno no servidor." });
    }
  }
}

export default new machineController();
