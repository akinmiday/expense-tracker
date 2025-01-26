import { Request, Response, NextFunction } from "express-serve-static-core";
import Expense from "../models/Expense";
import {
  analyzeExpense,
  generateSpendingInsights,
} from "../services/deepseekService";
import {
  getTotalSpending,
  getCategoryWiseSpending,
} from "../utils/expenseUtils";

/**
 * Add a new expense
 */
export const addExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { amount, description, date, userId } = req.body;

  // Validate request body
  if (!amount || !description || !userId) {
    res
      .status(400)
      .json({ error: "amount, description, and userId are required." });
    return;
  }

  try {
    // Analyze the expense description using DeepSeek API
    const analysis = await analyzeExpense(description);

    // Create a new expense
    const expense = new Expense({
      amount,
      description,
      category: analysis.category || "Uncategorized",
      date: date || new Date(),
      user: userId,
    });

    // Save the expense to the database
    await expense.save();

    // Return the created expense
    res.status(201).json(expense);
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ error: "Failed to add expense" });
  }
};

/**
 * Get spending insights for a specific time period
 */
export const getSpendingInsights = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userId, startDate, endDate } = req.body;

  // Validate request body
  if (!userId || !startDate || !endDate) {
    res
      .status(400)
      .json({ error: "userId, startDate, and endDate are required." });
    return;
  }

  try {
    // Get spending data
    const totalSpending = await getTotalSpending(
      userId,
      new Date(startDate),
      new Date(endDate)
    );
    const categorySpending = await getCategoryWiseSpending(
      userId,
      new Date(startDate),
      new Date(endDate)
    );

    // Generate insights using DeepSeek API
    const insights = await generateSpendingInsights({
      totalSpending,
      categorySpending,
      timePeriod: `${startDate} to ${endDate}`,
    });

    // Return the response
    res.status(200).json({ totalSpending, categorySpending, insights });
  } catch (error) {
    console.error("Error fetching spending insights:", error);
    res.status(500).json({ error: "Failed to fetch spending insights" });
  }
};
