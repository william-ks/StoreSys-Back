import { Store } from "../../entities/Store";
import { IFindBy, IStoreRepository } from "../IStoreRepository";
import { prisma } from "../../../../services/prisma";

export class StoreRepository implements IStoreRepository {
  async findBy({ key, value }: IFindBy): Promise<Store> {
    const store = await prisma.store.findFirst({
      where: {
        [key]: value,
      },
    });

    return store;
  }

  async save(props: Omit<Store, "id">): Promise<void> {
    await prisma.store.create({
      data: props,
    });
  }
}
