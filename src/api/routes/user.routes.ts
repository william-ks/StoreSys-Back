import { Router } from "express";
import usersControllers from "../controllers/users.controller";
import adminAuth from "../middlewares/adminAuth";
import validateBody from "../middlewares/validateBody";
import { UserCreateSchema } from "../schemas/users.schemas";

const userRouter = Router();

userRouter.post(
  "/user",
  validateBody(UserCreateSchema),
  usersControllers.create
);

userRouter.get("/user", usersControllers.readSelf);
userRouter.put("/user", usersControllers.updateSelf);

userRouter.use(adminAuth);

userRouter.get("/user/all", usersControllers.readAll);
userRouter.get("/user/find/:id", usersControllers.readOne);
userRouter.put("/user/:id", usersControllers.updateOther);

export default userRouter;
