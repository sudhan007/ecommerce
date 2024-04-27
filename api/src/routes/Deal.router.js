import { Router } from "express";
import { DealController } from "../controllers/Deal.controller.js";
import { body, query } from "express-validator";
import { upload } from "../middlewares/upload.js";

export const DealRouter = Router()
  .post('/add',
    body("name").isString(),
    body("description").isString(), 
    body("image").isString(),
    body("category").isMongoId(),
    upload.single("image"),
    DealController.addDeal)
  .get('/all', DealController.getDeals)
  .get('/', query("id").isMongoId(), DealController.getSingleDealByCategory)
  .delete("/", query("id").isMongoId(), DealController.deleteDeal)
  .put("/", query("id").isMongoId(),
    body("name").isString(),
    body("description").isString(), 
    body("image").isString(),
    upload.single("image"), DealController.updateDeal);
