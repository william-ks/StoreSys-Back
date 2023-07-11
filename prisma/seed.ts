import { PrismaClient } from "@prisma/client";

import bcrypt from "bcrypt";

async function main() {
  const prisma = new PrismaClient();
  try {
    const pass = await bcrypt.hash("teste123", 10);

    // creating hierarchies
    await prisma.hierarchies.createMany({
      data: [
        { name: "Developer" },
        { name: "Master" },
        { name: "Admin" },
        { name: "Employee" }
      ]
    })

    // Creating developer profile
    await prisma.user.create({
      data: {
        name: "developer",
        email: "dev@gmail.com",
        password: pass,
        hierarchy_id: 1,
      },
    });

    // creating base categories
    await prisma.category.createMany({
      data: [
        { description: "Deletados" },
        { description: "Calças" },
        { description: "Saias" },
        { description: "Intimas" },
      ],
    });

    // creating base payment methods
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
