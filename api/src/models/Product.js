import { Schema, model } from "mongoose";

const productSchema = new Schema({
  productName: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    enum: ["kg", "ltr"]
  },
  description: {
    type: String,
  },
  discount: {
    type: Number,
  },
  discountedPrice: {
    type: Number,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['inStock', 'outOfStock'],
    default: 'inStock',
  },
  availableQuantity: {
    type: Number,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  initialWeight: { type: Number, default: 1 },
  isHotDeal: { type: Boolean, default: false },
  ratings: [
    {
      type: Schema.Types.ObjectId,
      ref: "Rating",
    },
  ],
},
  {
    timestamps: true,
  }
);

export default model("Product", productSchema);
