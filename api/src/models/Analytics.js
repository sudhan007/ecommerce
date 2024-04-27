import { Schema, model } from "mongoose";

const analyticsSchema = new Schema({
  dailyAnalytics: [
    {
      type: Number,
    },
  ],
  weeklyAnalytics: [
    {
      type: Number,
    },
  ],
  monthlyAnalytics: [
    {
      type: Number,
    },
  ],
}, {
  timestamps: true,
});

export default model("Analytics", analyticsSchema);
