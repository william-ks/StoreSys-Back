import { Store } from "../../src/api/v2/entities/Store";
import {
  IFindBy,
  IStoreRepository,
} from "../../src/api/v2/repositories/IStoreRepository";
export class UserMemoryRepository implements IStoreRepository {
  public users: Store[] = [];

  async findBy({ key, value }: IFindBy): Promise<Store> {
    const user = this.users.find((el) => {
      return el[key] === value;
    });

    return user;
  }

  async save(props: Omit<Store, "id">): Promise<void> {
    this.users.push(new Store({ ...props }));
  }
}
