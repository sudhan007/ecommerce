import { Router } from "express";
import { StarexDetailsController } from "../controllers/Starexdetails.controller.js";
import { body, query } from "express-validator";

export const StarexdetailsRouter = Router()

    .post("/add", body("email").isString(), body("phoneNumber").isNumeric(), StarexDetailsController.createDetails)
    .put("/", query("id").isMongoId(), StarexDetailsController.updateDetails)
    .get("/details", StarexDetailsController.getDetails)