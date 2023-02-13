import { Request, Response } from "express";
import { prisma } from "../../services/prisma";
import { del, upload } from "../functions/images.func";

class productController {
  public async createImage(req: Request, res: Response): Promise<Response> {
    const { fieldname, encoding, size, ...data }: any = req.file;

    const acceptedFormats = ["jpeg", "jpg", "png", "bmp", "svg"];

    const accepted = acceptedFormats.find((el) => {
      return el === data.mimetype.split("/")[1];
    });

    if (!accepted) {
      return res.status(400).json({ message: "Formato inválido." });
    }

    try {
      const create = await upload({ ...data, path: "images" });

      return res.status(201).json(create);
    } catch (e) {
      return res.status(500).json({ message: "Erro interno no servidor." });
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { name, value, stock, url, path, category_id } = req.body;

    if (!name || !value || !stock || !category_id) {
      return res.status(400).json({ message: "Missing arguments." });
    }

    if (category_id <= 1) {
      return res.status(400).json({
        message: "Categoria inválida.",
      });
    }

    if (url || path) {
      if (!path || !url) {
        return res.status(400).json({ message: "Missing arguments." });
      }
    }

    try {
      const categoryExists = await prisma.category.findFirst({
        where: {
          id: category_id,
        },
      });

      if (!categoryExists) {
        return res.status(400).json({ message: "Essa categoria não existe." });
      }

      const product = await prisma.product.create({
        data: {
          name,
          value,
          stock,
          category: {
            connect: {
              id: category_id,
            },
          },
          image: {
            create: {
              url,
              path,
            },
          },
        },
      });

      return res.status(201).json(product);
    } catch (e) {
      return res.status(500).json({ message: "Erro interno no servidor." });
    }
  }

  public async readAll(req: Request, res: Response): Promise<Response> {
    try {
      const products = await prisma.product.findMany({
        where: {
          isDeleted: false,
        },
        include: {
          image: {
            select: {
              url: true,
            },
          },
          category: {
            select: {
              description: true,
            },
          },
        },
        orderBy: {
          id: "asc",
        },
      });

      return res.status(200).json(products);
    } catch (e) {
      return res.status(500).json({ message: "Erro interno servidor." });
    }
  }

  public async readOne(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    if (!Number(id)) {
      return res.status(400).json({ message: "Parâmetro inválido." });
    }

    try {
      const product = await prisma.product.findFirst({
        where: {
          AND: {
            isDeleted: false,
            id: Number(id),
          },
        },
        include: {
          image: {
            select: {
              url: true,
            },
          },
          category: {
            select: {
              description: true,
            },
          },
        },
      });

      if (!product) {
        return res.status(404).json({ message: "Produto não encontrado." });
      }

      return res.status(200).json(product);
    } catch (e) {
      return res.status(500).json({ message: "Erro interno servidor." });
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { name, value, stock, url, path, category_id } = req.body;

    if (!name && !value && !stock && !category_id) {
      return res
        .status(400)
        .json({ message: "Nenhum dado para ser atualizado." });
    }

    if (url || path) {
      if (!path || !url) {
        return res.status(400).json({ message: "Missing arguments." });
      }
    }

    if (!Number(id)) {
      return res.status(400).json({ message: "Parâmetro inválido." });
    }

    try {
      const product = await prisma.product.findFirst({
        where: {
          AND: {
            isDeleted: false,
            id: Number(id),
          },
        },
      });

      if (!product) {
        return res.status(404).json({ message: "Produto não encontrado." });
      }

      let dataToUpdate: any = {};

      if (name) {
        dataToUpdate.name = name;
      }

      if (value) {
        dataToUpdate.value = value;
      }

      if (stock) {
        dataToUpdate.stock = stock;
      }

      if (url) {
        dataToUpdate.url = url;
      }

      if (path) {
        dataToUpdate.path = path;
      }

      await prisma.product.update({
        data: {
          ...dataToUpdate,
        },
        where: {
          id: Number(id),
        },
      });

      return res.status(204).end();
    } catch (e) {
      return res.status(500).json({ message: "Erro interno servidor." });
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    if (!Number(id)) {
      return res.status(400).json({ message: "Parâmetro inválido." });
    }

    try {
      const product = await prisma.product.findFirst({
        where: {
          AND: {
            isDeleted: false,
            id: Number(id),
          },
        },
      });

      if (!product) {
        return res.status(404).json({ message: "Produto não encontrado." });
      }

      const image = await prisma.productImage.findFirst({
        where: {
          id: product.image_id as number,
        },
      });

      await del(image?.path as string);

      await prisma.product.update({
        data: {
          isDeleted: true,
          image_id: null,
          category_id: 1,
        },
        where: {
          id: Number(id),
        },
      });

      await prisma.productImage.delete({
        where: {
          id: image?.id,
        },
      });

      return res.status(204).end();
    } catch (e) {
      return res.status(500).json({ message: "Erro interno no servidor." });
    }
  }
}

export default new productController();
