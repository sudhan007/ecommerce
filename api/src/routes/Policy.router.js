import { Router } from "express";
import { PolicyController } from "../controllers/Policy.controller.js";
import { body, query } from "express-validator";

export const PolicyRouter = Router()
  .post("/add", PolicyController.addTermsAndPolicy)
  .get("/getpolicy", query("type").isString(), PolicyController.getTermsAndPolicy);





