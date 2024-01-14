import { uuid } from "uuidv4";

export class Store {
  public readonly id: string;
  public name: string;
  public email: string;
  public nick: string;
  public password: string;

  constructor(props: Omit<Store, "id">, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuid();
    }
  }
}
