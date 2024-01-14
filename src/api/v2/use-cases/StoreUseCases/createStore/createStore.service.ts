import { IStoreRepository } from "../../../repositories/IStoreRepository";
import { ICreateStoreDTO } from "./createStore.DTO";
import bcrypt from "bcrypt";

export class CreateStoreService {
  constructor(private storeRepository: IStoreRepository) {}

  async execute(props: ICreateStoreDTO) {
    const { email, name, password } = props;
    const emailAlreadyExists = await this.storeRepository.findBy({
      key: "email",
      value: email,
    });

    if (emailAlreadyExists) {
      throw {
        message: "Esse e-mail já está em nosso banco de dados.",
        code: 400,
      };
    }

    const encryptedPass = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password: encryptedPass,
    };

    this.storeRepository.save({
      ...newUser,
    });
  }
}
