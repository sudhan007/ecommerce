import cookieParser from "cookie-parser";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { config } from "dotenv";
import { connectDB } from "./config/db.js";
import BaseRouter from "./routes/index.js";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer);
app.set("socketio", io);

config();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://192.168.1.44:3000",
      "http://192.168.1.44:3001",
      "http://192.168.1.44:3002",
      "http://65.0.29.203:3000",
      "http://65.0.29.203:3001",
      "http://65.0.29.203:3002",
    ],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(helmet());
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", BaseRouter);

// connectDB().then(async () => {
//   // for (let i of Array(10).keys()) {
//   //   const _product = new Product({
//   //     productName: "Product" + i,
//   //     description: "3",
//   //     discount: 33 * Math.random() + 1,
//   //     discountedPrice: 300,
//   //     price: 333 * Math.random() + 100,
//   //     status: "inStock",
//   //     availableQuantity: 333,
//   //     image: "9a63f8e9-2dc7-438b-b96a-8e414b44d5d2.png",
//   //     category: "661ced096882bf51fee886d4",
//   //     initialWeight: 1 * Math.random() + 1,
//   //     isHotDeal: false,
//   //     ratings: [],
//   //   });
//   //   console.log(_product.productName, " - ", i);
//   //   await _product.save();
//   // }
//   for (let i = 10 ; i < 10; i++) {
//     const _product = new Product({
//       productName: "Product" + i,
//       description: "3",
//       discount: 33 * Math.random() + 1,
//       discountedPrice: 300,
//       price: 333 * Math.random() + 100,
//       status: "inStock",
//       availableQuantity: 333,
//       image: "9a63f8e9-2dc7-438b-b96a-8e414b44d5d2.png",
//       category: "661ced096882bf51fee886d4",
//       initialWeight: 1 * Math.random() + 1,
//       isHotDeal: false,
//       ratings: [],
//     });
//     console.log(_product.productName, " - ", i);
//     await _product.save();
//   }
// });
connectDB().then(async () => {
  console.log("Connected to database");
  // const categories = ["661cec586882bf51fee886b3", "661cec836882bf51fee886be", "661ced096882bf51fee886d4", "661cef4e6882bf51fee886f7"];

  // for (let j = 0; j < categories.length; j++) {
  //   const categoryId = categories[j];

  //   for (let i = 1; i <= 10; i++) {
  //     const productName = `Product${i + j * 10}`;
  //     const _product = new Product({
  //       productName: productName,
  //       description: "3",
  //       discount: 33 * Math.random() + 1,
  //       discountedPrice: 300,
  //       price: 333 * Math.random() + 100,
  //       status: "inStock",
  //       availableQuantity: 333,
  //       image: "9a63f8e9-2dc7-438b-b96a-8e414b44d5d2.png",
  //       category: categoryId,
  //       initialWeight: 1 * Math.random() + 1,
  //       isHotDeal: false,
  //       ratings: [],
  //     });
  //     console.log(_product.productName, " - ", i);
  //     await _product.save();
  //   }
  // }
});

export default httpServer;
