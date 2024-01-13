import { User } from "../../src/api/v2/entities/User";
import {
  IFindBy,
  IUserRepository,
} from "./../../src/api/v2/repositories/IUserRepository";
export class UserMemoryRepository implements IUserRepository {
  public users: User[] = [];

  async findBy({ key, value }: IFindBy): Promise<User> {
    const user = this.users.find((el) => {
      return el[key] === value;
    });

    return user;
  }

  async save(props: Omit<User, "id">): Promise<void> {
    this.users.push(new User({ ...props }));
  }
}
