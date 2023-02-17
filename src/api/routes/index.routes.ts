import { NextFunction, Request, Response, Router } from "express";
import loginController from "../controllers/login.controller";
import auth from "../middlewares/auth";
import validateBody from "../middlewares/validateBody";
import { UserLoginSchema } from "../schemas/users.schemas";
import categoryRouter from "./category.routes";
import machinesRouter from "./machines.routes";
import productRouter from "./product.routes";
import saleRouter from "./sale.routes";
import userRouter from "./user.routes";

const router = Router();

router.post("/login", validateBody(UserLoginSchema), loginController);

router.use(auth);

router.use(userRouter);
router.use(productRouter);
router.use(categoryRouter);
router.use(machinesRouter);
router.use(saleRouter);

export default router;
