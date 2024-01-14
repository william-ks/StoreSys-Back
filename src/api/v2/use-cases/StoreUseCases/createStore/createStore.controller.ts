import { Request, Response } from "express";
import { CreateStoreService } from "./createStore.service";

export class CreateStoreController {
  constructor(private createUserService: CreateStoreService) {}

  async handle(req: Request, res: Response) {
    const { name, email, password } = req.body;

    await this.createUserService.execute({ name, email, password });
    return res.status(201).end();
  }
}
