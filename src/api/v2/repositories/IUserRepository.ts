import { User } from "../entities/User";

export interface IFindBy {
  key: "email" | "id";
  value: string;
}

export interface IUserRepository {
  findBy(props: IFindBy): Promise<User>;
  save(props: Omit<User, "id">): Promise<void>;
}
