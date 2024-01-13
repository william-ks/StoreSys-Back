import { User } from "../../entities/User";
import { IFindBy, IUserRepository } from "../IUserRepository";
import { prisma } from "../../../../services/prisma";

export class UserRepository implements IUserRepository {
  async findBy({ key, value }: IFindBy): Promise<User> {
    const user = await prisma.user.findFirst({
      where: {
        [key]: value,
      },
    });

    return user;
  }

  async save(props: Omit<User, "id">): Promise<void> {
    await prisma.user.create({
      data: props,
    });
  }
}
