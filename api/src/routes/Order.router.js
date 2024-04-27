import { Router } from "express";
import { OrderController } from "../controllers/Order.controller.js";
import { body, query } from "express-validator";
import { verifyUser } from "../middlewares/middleware.js";
import { upload } from "../middlewares/upload.js";

export const OrderRouter = Router()
  .post("/add", OrderController.createOrder)
  .get("/all", OrderController.getOrders)
  .get("/getorder", OrderController.getOrdersByUserId)
  .get("/", OrderController.getOrder)
  .put("/", OrderController.updateOrder)
  .delete("/", OrderController.deleteOrder)
  .get("/trackorder", OrderController.trackOrder)
  .post("/deliveryman", OrderController.deliveryMan)
  .put("/trackorder", OrderController.updateTracking)
  // payment
  .post("/paymenthistory", OrderController.paymentHistory)
  .get("/paymenthistory", OrderController.getPaymentHistory)
  // analytics
  .get("/dailyanalytics", OrderController.dailyAnalytics)
  .get("/weeklyanalytics", OrderController.weeklyAnalytics)
  .get("/monthlyanalytics", OrderController.monthlyAnalytics)
  .get("/getorderdetails", OrderController.getOrderDetails);
