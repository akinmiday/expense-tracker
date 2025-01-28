import { Request, Response, NextFunction } from "express";
import Expense from "../models/Expense";
import Insights from "../models/Insights";
import {
  analyzeExpense,
  generateSpendingInsights,
} from "../services/deepseekService";
import {
  getTotalSpending,
  getCategoryWiseSpending,
} from "../utils/expenseUtils";

// Extend Request to include userId from authMiddleware
interface AuthenticatedRequest extends Request {
  userId?: string;
}

/**
 * Add a new expense
 */
export const addExpense = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { amount, description, date } = req.body;
  const userId = req.userId;

  // Validate required fields
  if (!amount || !description || !userId) {
    const missingFields = [
      !amount && "amount",
      !description && "description",
      !userId && "userId",
    ]
      .filter(Boolean)
      .join(", ");
    res
      .status(400)
      .json({ error: `Missing required fields: ${missingFields}` });
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
    console.error("Error adding expense:", {
      error,
      userId,
      requestBody: req.body,
    });
    res
      .status(500)
      .json({ error: "Failed to add expense. Please try again later." });
  }
};

/**
 * Get spending insights for a specific time period
 */
export const getSpendingInsights = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { startDate, endDate } = req.body;
  const userId = req.userId;

  if (!userId || !startDate || !endDate) {
    const missingFields = [
      !userId && "userId",
      !startDate && "startDate",
      !endDate && "endDate",
    ]
      .filter(Boolean)
      .join(", ");
    res
      .status(400)
      .json({ error: `Missing required fields: ${missingFields}` });
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

    // Save insights to the database
    const insight = new Insights({
      user: userId,
      timePeriod: `${startDate} to ${endDate}`,
      insights,
      totalSpending,
      categorySpending,
    });
    await insight.save();

    // Return the insights
    res.status(200).json({ totalSpending, categorySpending, insights });
  } catch (error) {
    console.error("Error fetching spending insights:", {
      error,
      userId,
      requestBody: req.body,
    });
    res.status(500).json({
      error: "Failed to fetch spending insights. Please try again later.",
    });
  }
};

/**
 * Get all previous insights for the authenticated user.
 */
export const getPreviousInsights = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized. User ID is missing." });
    return;
  }

  try {
    // Fetch all insights for the authenticated user
    const insights = await Insights.find({ user: userId }).sort({
      createdAt: -1,
    });

    // Return the insights
    res.status(200).json(insights);
  } catch (error) {
    console.error("Error fetching previous insights:", { error, userId });
    res.status(500).json({
      error: "Failed to fetch previous insights. Please try again later.",
    });
  }
};

/**
 * Get all expenses for the authenticated user
 */
export const getUserExpenses = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized. User ID is missing." });
    return;
  }

  try {
    // Fetch all expenses for the authenticated user
    const expenses = await Expense.find({ user: userId }).sort({ date: -1 }); // Sort by date in descending order

    // Return the expenses
    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error fetching user expenses:", { error, userId });
    res.status(500).json({
      error: "Failed to fetch user expenses. Please try again later.",
    });
  }
};
