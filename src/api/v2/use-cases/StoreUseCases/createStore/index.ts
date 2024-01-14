import { StoreRepository } from "../../../repositories/implementations/StoreRepository";
import { CreateStoreController } from "./createStore.controller";
import { CreateStoreService } from "./createStore.service";

const storeRepository = new StoreRepository();
const createStoreService = new CreateStoreService(storeRepository);
const createStoreController = new CreateStoreController(createStoreService);

export { createStoreController, createStoreService };
