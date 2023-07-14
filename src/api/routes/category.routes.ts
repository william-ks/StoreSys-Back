import { Router } from "express";
import adminAuth from "../middlewares/adminAuth";
import validateBody from "../middlewares/validateBody";
import categoryController from "../controllers/category.controller";
import { categoryCreateSchema } from "../schemas/categories.schemas";

const categoryRouter = Router();

categoryRouter.get("/category", categoryController.readAll);

// categoryRouter.use(adminAuth);

categoryRouter.post(
  "/category",
  validateBody(categoryCreateSchema),
  categoryController.create
);

categoryRouter.put(
  "/category/:id",
  validateBody(categoryCreateSchema),
  categoryController.update
);

categoryRouter.delete("/category/:id", categoryController.delete);

export default categoryRouter;
