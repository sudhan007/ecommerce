import { Router } from "express";
import { CouponController } from "../controllers/Coupon.controller.js";
import { body, query } from "express-validator";

export const CouponRouter = Router()
.post(
    "/add",
    CouponController.createCoupon
  )
  .get("/", query("id").isMongoId(), CouponController.getCoupon)
  .get("/all", CouponController.getAllCoupons)
  .put("/", CouponController.updateCoupon)
  .delete("/", query("id").isMongoId(), CouponController.deleteCoupon);

