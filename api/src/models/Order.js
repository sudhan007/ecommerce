import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      default: "confirmed",
    },
    deliveryPerson: {
      type: Schema.Types.ObjectId,
      ref: "Deliveryperson",
      default: null,
    },
    trackingNumber: {
      type: String,
      default: null,
    },
    orderSummary: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
        },
        price: {
          type: Number,
        },
      },
    ],
    couponId: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
    },
    estimateDelivery: {
      type: Date,
    },
    from: {
      type: String,
      default: "Starex ",
    },
    total: {
      type: Number,
      default: 0,
    },
    address: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    location: {
      type: Object,
    },
    paymentMethod: {
      type: String,
    },
    deliveryCharge: {
      type: Number,
    },

  },
  {
    timestamps: true,
  }
);

export default model("Order", orderSchema);
