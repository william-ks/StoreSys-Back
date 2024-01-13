import { Router } from "express";
import { createUserController } from "./createUser";
const userRouter = Router();

userRouter.post("/user/create", (req, res) => {
  return createUserController.handle(req, res);
});

export default userRouter;
