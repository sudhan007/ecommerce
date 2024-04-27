import { Schema, model } from "mongoose";

const couponSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true,
      },
      discountPercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
      expirationDate: {
        type: Date,
        required: true,
      },
  },
  {
    timestamps: true,
  }
  );

export default model("Coupon",couponSchema);