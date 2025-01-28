import mongoose, { Schema, Document } from "mongoose";

export interface InsightDocument extends Document {
  user: string;
  timePeriod: string;
  insights: string;
  totalSpending: number;
  categorySpending: Record<string, number>;
  createdAt: Date;
}

const InsightSchema: Schema = new Schema(
  {
    user: { type: String, required: true },
    timePeriod: { type: String, required: true },
    insights: { type: String, required: true },
    totalSpending: { type: Number, required: true },
    categorySpending: { type: Object, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<InsightDocument>("Insight", InsightSchema);
