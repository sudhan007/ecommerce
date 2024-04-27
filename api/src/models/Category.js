import { Schema, model } from "mongoose";

const categorySchema = new Schema({
  categoryName: { type: String, required: true },
  image: { type: String, required: true },
},
  {
    timestamps: true,
  }
);

export default model("Category", categorySchema);