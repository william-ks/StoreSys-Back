import { Router, Request, Response } from "express";
import usersControllers from "../controllers/users.controller";
import adminAuth from "../middlewares/adminAuth";
import validateBody from "../middlewares/validateBody";
import { UserCreateSchema } from "../schemas/users.schemas";

const userRouter = Router();

userRouter.get("/user", usersControllers.readSelf);
userRouter.put("/user", usersControllers.updateSelf);

userRouter.post(
  "/user",
  adminAuth(2),
  validateBody(UserCreateSchema),
  usersControllers.create
);
userRouter.get("/user/all", adminAuth(2), usersControllers.readAll);
userRouter.get("/user/find/:id", adminAuth(2), usersControllers.readOne);
userRouter.put("/user/:id", adminAuth(2), usersControllers.updateOther);

export default userRouter;
