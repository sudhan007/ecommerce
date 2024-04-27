import { Router } from "express";
import { RatingController } from "../controllers/Rating.controller.js";
import { body, query } from "express-validator";

export const RatingRouter = Router()
.post(
    "/add",
    RatingController.createRating
  )
  .get("/", query("id").isMongoId(), RatingController.getRating)
  .get("/all", RatingController.getRatings)
  .put("/", query("id").isMongoId(), RatingController.updateRating)
  .delete("/", query("id").isMongoId(), RatingController.deleteRating);

