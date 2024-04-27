import { Router } from "express";
import { UserController } from "../controllers/User.controller.js";
import { body, query } from "express-validator";
import { verifyUser } from "../middlewares/middleware.js";
import { upload } from "../middlewares/upload.js";

export const UserRouter = Router()
  // .get('/',UserController.GetCookie)

  // .post("/signup",
  //     UserController.signUp
  // )
  .post("/login", UserController.login)
  // .post("/register",
  //     UserController.register
  // )
  .put("/", UserController.updateUser)
  .post(
    "/forget-password",
    body("email").isString(),
    UserController.forgetPassword
  )
  .get("/", query("id").isMongoId(), UserController.getUser)
  .get("/minimal", query("id").isMongoId(), UserController.getMinimalData)
  .put("/changepassword", UserController.changePassword)
  .get("/all", UserController.getUsers)
  .post("/updatenotifications", UserController.updateNotifications)
  .get("/filter", UserController.filter)
  .post("/insertcart", UserController.insertCart)
  .get("/getallcounts", UserController.getAllCounts)

  // admin login
  .post(
    "/adminlogin",
    body("email").isString(),
    body("password").isString(),
    UserController.adminLogin
  )

  .put(
    "/editlogin",
    body("email").isString(),
    body("password").isString(),
    body("image").isString(),
    upload.single("image"),
    UserController.editAdminLogin
  );
