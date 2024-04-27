import { Router } from "express";
import { UserRouter } from "./User.router.js";
import { fileRouter } from "./Files.router.js";
import { ProductRouter } from "./Product.router.js";
import { CategoryRouter } from "./Category.router.js";
import { RatingRouter } from "./Rating.router.js";
import { OrderRouter } from "./Order.router.js";
import { OfferRouter } from "./Offer.router.js";
import { DealRouter } from "./Deal.router.js";
import { AddressRouter } from "./Address.router.js";
import { CartRouter } from "./Cart.router.js";
import { PolicyRouter } from "./Policy.router.js";
import { CouponRouter } from "./Coupon.router.js";
import { DeliverypersonRouter } from "./Deliveryperson.router.js";
import { StarexdetailsRouter } from "./Starexdetails.router.js";

const BaseRouter = Router();

BaseRouter
  .use("/user", UserRouter)
  .use("/files", fileRouter)
  .use("/product", ProductRouter)
  .use("/category", CategoryRouter)
  .use("/rating", RatingRouter)
  .use("/order", OrderRouter)
  .use("/offer", OfferRouter)
  .use("/deal", DealRouter)
  .use("/address", AddressRouter)
  .use("/cart", CartRouter)
  .use("/policy", PolicyRouter)
  .use("/coupon", CouponRouter)
  .use("/deliveryperson", DeliverypersonRouter)
  .use("/starexdetails", StarexdetailsRouter);

export default BaseRouter;
