import { Request, Response } from "express";
import { prisma } from "../../services/prisma";

class categoryController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { description } = req.body;
    try {
      const alreadyExists = await prisma.category.findFirst({
        where: {
          description,
        },
      });

      if (alreadyExists) {
        return res.status(400).json({
          message: "Essa categoria já existe.",
        });
      }

      await prisma.category.create({
        data: {
          description,
        },
      });

      return res.status(201).end();
    } catch (e) {
      return res.status(500).json({ message: "Erro interno no servidor." });
    }
  }

  public async readAll(req: Request, res: Response): Promise<Response> {
    try {
      const categories = await prisma.category.findMany({
        orderBy: {
          id: "asc",
        },
      });

      return res.status(200).json(categories);
    } catch (e) {
      return res.status(500).json({ message: "Erro interno no servidor." });
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { description } = req.body;
    const { id } = req.params;

    if (!Number(id)) {
      return res.status(400).json({ message: "Parâmetro inválido." });
    }

    try {
      const validId = await prisma.category.findFirst({
        where: {
          id: Number(id),
        },
      });

      if (!validId) {
        return res.status(404).json({ message: "Categoria não encontrada." });
      }

      const alreadyExists = await prisma.category.findFirst({
        where: {
          AND: {
            description,
          },
          NOT: {
            id: Number(id),
          },
        },
      });

      if (alreadyExists) {
        return res.status(400).json({
          message: "Já existe uma categoria com esse nome.",
        });
      }

      await prisma.category.update({
        data: {
          description,
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

    if (!Number(id) || Number(id) <= 1) {
      return res.status(400).json({ message: "Parâmetro inválido." });
    }
    try {
      const validId = await prisma.category.findFirst({
        where: {
          id: Number(id),
        },
      });

      if (!validId) {
        return res.status(404).json({ message: "Categoria não encontrada." });
      }

      const productConnected = await prisma.product.findFirst({
        where: {
          category_id: Number(id),
        },
      });

      if (productConnected) {
        return res.status(400).json({
          message:
            "Você não pode apagar uma categoria enquanto existe um produto vinculado a ela.",
        });
      }

      await prisma.category.delete({
        where: {
          id: Number(id),
        },
      });

      return res.status(204).json();
    } catch (e) {
      return res.status(500).json({ message: "Erro interno no servidor." });
    }
  }
}

export default new categoryController();
