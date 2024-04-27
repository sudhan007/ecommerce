import { Router } from "express";
import { AddressController } from "../controllers/Address.controller.js";
import { body, query } from "express-validator";
import { upload } from "../middlewares/upload.js";

export const AddressRouter = Router()
  .post("/add", AddressController.createAddress)
  .get("/all",AddressController.getAddresses)
  .get("/", AddressController.getAddress)
  .put("/", query("id").isMongoId(), AddressController.updateAddress)
  .delete("/", query("id").isMongoId(), AddressController.deleteAddress);
