import { Request, Response, NextFunction } from "express";
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
  const { amount, description, date } = req.body;

  // Validate request body
  if (!amount || !description) {
    res.status(400).json({ error: "amount and description are required." });
    return;
  }

  // Extract userId from the authenticated user
  const userId = req.userId;

  // Ensure userId is defined
  if (!userId) {
    res.status(401).json({ error: "Unauthorized. User ID is missing." });
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
      user: userId, // Associate the expense with the authenticated user
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
  const { startDate, endDate } = req.body;

  // Validate request body
  if (!startDate || !endDate) {
    res.status(400).json({ error: "startDate and endDate are required." });
    return;
  }

  // Extract userId from the authenticated user
  const userId = req.userId;

  // Ensure userId is defined
  if (!userId) {
    res.status(401).json({ error: "Unauthorized. User ID is missing." });
    return;
  }

  try {
    // Get spending data for the authenticated user
    const totalSpending = await getTotalSpending(
      userId, // userId is guaranteed to be a string here
      new Date(startDate),
      new Date(endDate)
    );
    const categorySpending = await getCategoryWiseSpending(
      userId, // userId is guaranteed to be a string here
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
