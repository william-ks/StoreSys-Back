import { IUserRepository } from "../../../repositories/IUserRepository";
import { ICreateStoreDTO } from "./createStore.DTO";
import bcrypt from "bcrypt";

export class CreateStoreService {
  constructor(private userRepository: IUserRepository) {}

  async execute(props: ICreateStoreDTO) {
    const { email, name, password } = props;
    const emailAlreadyExists = await this.userRepository.findBy({
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

    this.userRepository.save({
      ...newUser,
    });
  }
}
