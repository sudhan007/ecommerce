import { Schema, model } from "mongoose";

const addressSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    pincode: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    houseNo: {
      type: String,
      required: false,
    },
    street: {
      type: String,
      required: false,
    },
    landmark: {
      type: String,
    },
    addressType: {
      type: String,
      enum: ["Home", "Office", "Other"],
      default: "Home",
    },
    latitude: {
      type: Number,
      default: 0,
      required: false,
    },
    longitude: {
      type: Number,
      default: 0,
      required: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    mapAddress: {
      type: String,
      required: false,
    },

  },
  {
    timestamps: true,
  }
);

export default model("Address", addressSchema);
