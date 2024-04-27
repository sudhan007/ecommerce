import { Schema, model } from "mongoose";

const dealSchema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    expirationDate: { type: Date },
    description: { type: String },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Deal", dealSchema);
