import { Router } from "express";
import multer from "../../services/multer";
import productController from "../controllers/product.controller";
import adminAuth from "../middlewares/adminAuth";
import validateBody from "../middlewares/validateBody";
import {
  ProductCreateSchema,
  ProductUpdateSchema,
} from "../schemas/products.schemas";

const productRouter = Router();

productRouter.get("/product", productController.readAll);
productRouter.get("/product/:id", productController.readOne);

productRouter.use(adminAuth);

productRouter.post(
  "/product/image",
  multer.single("image"),
  productController.createImage
);

productRouter.post(
  "/product",
  validateBody(ProductCreateSchema),
  productController.create
);

productRouter.put(
  "/product/:id",
  // validateBody(ProductUpdateSchema),
  productController.update
);

productRouter.delete("/product/:id", productController.delete);

export default productRouter;
