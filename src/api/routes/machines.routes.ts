import { Router } from "express";
import machinesController from "../controllers/machines.controller";
import adminAuth from "../middlewares/adminAuth";
import validateBody from "../middlewares/validateBody";
import {
    machineCreateSchema,
    machineUpdateSchema
} from "../schemas/machines.schema";

const machinesRouter = Router();

machinesRouter.get("/machine", machinesController.read);

// machinesRouter.use(adminAuth);

machinesRouter.post(
  "/machine",
  validateBody(machineCreateSchema),
  machinesController.create
);

machinesRouter.put(
  "/machine/:id",
  validateBody(machineUpdateSchema),
  machinesController.update
);

machinesRouter.delete("/machine/:id", machinesController.delete);

export default machinesRouter;
