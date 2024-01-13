import { Router } from "express";
import userRouter from "./use-cases/UserUseCases/user.routes";

const router = Router();

router.use(userRouter);

export default router;
