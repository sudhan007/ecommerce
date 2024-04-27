import { Router } from "express";
import { ProuctController } from "../controllers/Product.controllers.js";
import { body, query } from "express-validator";
import { upload } from "../middlewares/upload.js";

export const ProductRouter = Router()
  .post(
    "/add",
    body("productName").isString(),
    body("price").isNumeric(),
    body("image").isString(),
    body("category").isMongoId(),
    upload.single("image"),
    ProuctController.addProduct
  )
  .get("/all", ProuctController.getProducts)
  .get("/", query("id").isMongoId(), ProuctController.getProductById)
  .delete("/", query("id").isMongoId(), ProuctController.deleteProduct)
  // .put("/", query("id").isMongoId(), ProuctController.updateProduct)
  .put(
    "/",
    query("id").isMongoId(),
    upload.single("image"), // Add this line to handle file upload
    ProuctController.updateProduct
  )
  .get("/filter", ProuctController.filterProducts)
  .put("/sethotdeal", ProuctController.setHotDeal)
  .get("/hotdeal/all", ProuctController.getHotDeals)
  .get("/hotdeal/", ProuctController.getHotDeal)
  .get("/search", ProuctController.searchProducts);
