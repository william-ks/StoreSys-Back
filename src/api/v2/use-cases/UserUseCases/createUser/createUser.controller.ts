import { Request, Response } from "express";
import { CreateUserService } from "./createUser.service";

export class CreateUserController {
  constructor(private createUserService: CreateUserService) {}

  async handle(req: Request, res: Response) {
    const { name, email, password } = req.body;
    const { id } = req.user;

    await this.createUserService.execute({ name, email, password }, id);
  }
}
