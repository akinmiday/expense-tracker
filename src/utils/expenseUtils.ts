import { IExpense } from "../models/Expense";
import Expense from "../models/Expense";

/**
 * Get expenses for a specific time period
 */
export const getExpensesByTimePeriod = async (
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<IExpense[]> => {
  try {
    const expenses = await Expense.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    });
    return expenses;
  } catch (error) {
    console.error("Error fetching expenses by time period:", error);
    throw new Error("Failed to fetch expenses by time period");
  }
};

/**
 * Get total spending for a specific time period
 */
export const getTotalSpending = async (
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<number> => {
  try {
    const expenses = await getExpensesByTimePeriod(userId, startDate, endDate);
    const total = expenses.reduce(
      (sum: number, expense: IExpense) => sum + expense.amount,
      0
    );
    return total;
  } catch (error) {
    console.error("Error calculating total spending:", error);
    throw new Error("Failed to calculate total spending");
  }
};

/**
 * Get category-wise spending for a specific time period
 */
export const getCategoryWiseSpending = async (
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<{ [key: string]: number }> => {
  try {
    const expenses = await getExpensesByTimePeriod(userId, startDate, endDate);
    const categoryTotals: { [key: string]: number } = {};

    expenses.forEach((expense: IExpense) => {
      if (categoryTotals[expense.category]) {
        categoryTotals[expense.category] += expense.amount;
      } else {
        categoryTotals[expense.category] = expense.amount;
      }
    });

    return categoryTotals;
  } catch (error) {
    console.error("Error calculating category-wise spending:", error);
    throw new Error("Failed to calculate category-wise spending");
  }
};
