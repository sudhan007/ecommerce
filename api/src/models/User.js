// import { Schema, model } from "mongoose";

// const userSchema = new Schema(
//   {
//     role: {
//       type: String,
//       enum: ["user", "admin"],
//       default: "user",
//     },
//     firstName: {
//       type: String,
//     },
//     email: {
//       type: String,
//     },
//     lastName: {
//       type: String,
//     },
//     phoneNumber: {
//       type: Number,
//     },
//     adminId: {
//       type: Schema.Types.ObjectId,
//       required: false,
//     },
//     image: {
//       type: String,
//     },
//     companyName: {
//       type: String,
//     },
//     country: {
//       type: String,
//     },
//     state: {
//       type: String,
//     },
//     zipcode: {
//       type: String,
//     },
//     currentPassword: {
//       type: String,
//     },
//     alladdress: {
//       type: String,
//     },
//     message: {
//       type: String,
//     },
//     fillee: {
//       type: String,
//     },
//     userfirstame: {
//       type: String,
//     },
//     userlastname: {
//       type: String,
//     },
//     userphonenumber: {
//       type: Number,
//     },
//     useremail: {
//       type: String,
//     },
//     orderHistory: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "Order",
//       },
//     ],
//     addresses: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "Address",
//       },
//     ],
//     cartId: {
//       type: Schema.Types.ObjectId,
//       ref: "Cart",
//     },
//   },

//   {
//     timestamps: true,
//   }
// );

// export default model("User", userSchema);


import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    role: { type: String, enum: ["user", "admin"], default: "user" },
    firstName: { type: String },
    email: { type: String },
    lastName: { type: String },
    phoneNumber: { type: Number },
    adminId: { type: Schema.Types.ObjectId, required: false },
    image: { type: String },
    companyName: { type: String },
    country: { type: String },
    state: { type: String },
    zipcode: { type: String },
    currentPassword: { type: String },
    alladdress: { type: String },
    message: { type: String },
    fillee: { type: String },
    userfirstame: { type: String },
    userlastname: { type: String },
    userphonenumber: { type: Number },
    orderHistory: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    addresses: [{ type: Schema.Types.ObjectId, ref: "Address" }],
    cartId: { type: Schema.Types.ObjectId, ref: "Cart" },
  },
  { timestamps: true }
);

export default model("User", userSchema);