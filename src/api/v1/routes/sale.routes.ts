import { Router } from "express";
import saleController from "../controllers/sale.controller";
import adminAuth from "../middlewares/adminAuth";
import validateBody from "../middlewares/validateBody";
import {
  machineCreateSchema,
  machineUpdateSchema,
} from "../schemas/machines.schema";

const saleRouter = Router();

saleRouter.get("/sales", saleController.readAll);
saleRouter.get("/payments", saleController.readPaymentsMethods);
saleRouter.get("/sales/:id", saleController.readOne);

saleRouter.post(
  "/sales",
  // validateBody(machineCreateSchema),
  saleController.create
);

// saleRouter.use(adminAuth);

saleRouter.put(
  "/sales/:id",
  // validateBody(machineUpdateSchema),
  saleController.update
);

saleRouter.delete("/sales/:id", saleController.delete);

export default saleRouter;
