import { Router } from "express";
import { DeliverypersonController } from "../controllers/Deliveryperson.controller.js";
import { body, query } from "express-validator";

export const DeliverypersonRouter = Router()

    .post("/add", body("name").isString(), body("phoneNumber").isNumeric(), body("password").isString(), DeliverypersonController.createDeliveryPerson)
    .post("/login", DeliverypersonController.DeliverypersonLogin)
    .get("/all", DeliverypersonController.getAllDeliveryPersons)
    .get("/active", DeliverypersonController.availableDeliveryPersons)
    .get("/getorder", DeliverypersonController.getOrdersByDeliveryPerson)
    .post("/finish", DeliverypersonController.completedOrder)
    .get("/completedorders", DeliverypersonController.getCompletedOrders)
    .get("/", query("id").isMongoId(), DeliverypersonController.getDeliveryPerson)
    .put("/", query("id").isMongoId(), DeliverypersonController.updateDeliveryPerson)
    .delete("/", query("id").isMongoId(), DeliverypersonController.deleteDeliveryPerson);

