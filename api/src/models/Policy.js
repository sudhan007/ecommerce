import { Schema, model } from "mongoose";

const policySchema = new Schema({
    type: { type: String, enum: ["terms", "privacy"],required: true },
    content: { type: String,required: true },
  date: { type: Date, default: Date.now() },
});

export default model("Policy", policySchema);
