import { PrismaClient } from "@prisma/client";

import bcrypt from "bcrypt";

async function main() {
  const prisma = new PrismaClient();
  try {
    const pass = await bcrypt.hash("teste123", 10);

    await prisma.user.create({
      data: {
        name: "developer",
        email: "dev@gmail.com",
        password: pass,
        role: "ADMIN",
      },
    });

    await prisma.category.createMany({
      data: [
        { description: "Deletados" },
        { description: "Calças" },
        { description: "Saias" },
        { description: "Intimas" },
      ],
    });

    await prisma.saleType.createMany({
      data: [
        { title: "Dinheiro" },
        { title: "Pix" },
        { title: "Credito" },
        { title: "Debito" },
      ],
    });
  } catch (e) {
    return;
  }
}

main();
