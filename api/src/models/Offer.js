import { Schema, model } from "mongoose";

const offerSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: {type: String},
    category: { 
      type: Schema.Types.ObjectId, 
      ref: 'Category', 
      required: true 
    },
  },
  {
    timestamps: true,
  }
  );

export default model("Offer",offerSchema);