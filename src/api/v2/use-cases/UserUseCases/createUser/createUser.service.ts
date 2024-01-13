import { IUserRepository } from "../../../repositories/IUserRepository";
import { ICreateUserDTO } from "./createUser.DTO";
import bcrypt from "bcrypt";

export class CreateUserService {
  constructor(private userRepository: IUserRepository) {}

  async execute(props: ICreateUserDTO) {
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
