import { Router } from "express";
import { OfferController } from "../controllers/Offer.controller.js";
import { body, query } from "express-validator";
import { upload } from "../middlewares/upload.js";

export const OfferRouter = Router()
  .post('/add',
    body("name").isString(),
    body("description").isString(),
    body("image").isString(),
    upload.single("image"),
    OfferController.addOffer)
  .get('/all', OfferController.getOffers)
  .get('/', query("id").isMongoId(), OfferController.getSingleOfferByCategory)
  .delete("/", query("id").isMongoId(), OfferController.deleteOffer)
  .put("/", query("id").isMongoId(),
    body("name").isString(),
    body("description").isString(),
    body("image").isString(),
    upload.single("image"), OfferController.updateOffer);










