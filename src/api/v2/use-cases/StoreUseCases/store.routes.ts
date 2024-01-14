import { Router } from "express";
import { createStoreController } from "./createStore";
const storeRouter = Router();

storeRouter.post("/user/create", (req, res) => {
  return createStoreController.handle(req, res);
});

export default storeRouter;
