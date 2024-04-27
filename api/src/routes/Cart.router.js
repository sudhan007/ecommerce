import { Router } from "express";
import { CartController } from "../controllers/Cart.controller.js";
import { body, query } from "express-validator";

export const CartRouter = Router()
  .get("/", CartController.getCart)
  .post("/add", CartController.addCart)
  .put("/", query("id").isMongoId(), CartController.updateCart)
  .delete("/", query("id").isMongoId(), CartController.deleteCart);
