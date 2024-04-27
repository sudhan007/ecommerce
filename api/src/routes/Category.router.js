import { Router } from "express";
import { CategoryController } from "../controllers/Category.controller.js";
import { body, query } from "express-validator";
import {upload} from "../middlewares/upload.js";

export const CategoryRouter = Router()
.post(
    "/add",
    body("categoryName").isString(),
    body("image").isString(),
    upload.single("image"),
    CategoryController.createCategory
  )
  .get("/", query("id").isMongoId(), CategoryController.getCategory)
  .get("/all", CategoryController.getCategories)
  .put("/", query("id").isMongoId(),
      body("categoryName").isString(),
      body("image").isString(),
  upload.single("image"), CategoryController.updateCategory)
  .delete("/", query("id").isMongoId(), CategoryController.deleteCategory);

