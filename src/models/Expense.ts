import mongoose, { Document, Schema } from "mongoose";

export interface IExpense extends Document {
  amount: number;
  description: string;
  category: string;
  date: Date;
  user: mongoose.Types.ObjectId;
}

const ExpenseSchema: Schema = new Schema({
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, default: "Uncategorized" },
  date: { type: Date, default: Date.now }, // Track the date of the expense
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model<IExpense>("Expense", ExpenseSchema);
