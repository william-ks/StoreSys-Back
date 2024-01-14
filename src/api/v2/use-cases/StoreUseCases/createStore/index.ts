import { UserRepository } from "./../../../repositories/implementations/UserRepository";
import { CreateStoreController } from "./createStore.controller";
import { CreateStoreService } from "./createStore.service";

const userRepository = new UserRepository();
const createStoreService = new CreateStoreService(userRepository);
const createStoreController = new CreateStoreController(createStoreService);

export { createStoreController, createStoreService };
