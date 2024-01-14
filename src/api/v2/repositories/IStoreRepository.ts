import { Store } from "../entities/Store";

export interface IFindBy {
  key: "email" | "id";
  value: string;
}

export interface IStoreRepository {
  findBy(props: IFindBy): Promise<Store>;
  save(props: Omit<Store, "id">): Promise<void>;
}
