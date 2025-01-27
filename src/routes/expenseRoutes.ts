import express from "express";
import {
  addExpense,
  getSpendingInsights,
  getUserExpenses,
} from "../controllers/expenseController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * Route to add a new expense
 * POST /api/expenses
 * Request Body:
 * {
 *   "amount": 20,
 *   "description": "Lunch at McDonald's",
 *   "date": "2023-10-05"
 * }
 * Response Example:
 * {
 *   "amount": 20,
 *   "description": "Lunch at McDonald's",
 *   "category": "Food",
 *   "date": "2023-10-05",
 *   "user": "123",
 *   "_id": "456"
 * }
 * Error Example:
 * {
 *   "error": "Missing required fields: amount, description"
 * }
 */
router.post("/expenses", authMiddleware, addExpense);

/**
 * Route to get spending insights for a specific time period
 * GET /api/expenses/insights?startDate=2023-10-01&endDate=2023-10-31
 * Query Parameters:
 *   - startDate: Start of the time period (required)
 *   - endDate: End of the time period (required)
 * Response Example:
 * {
 *   "totalSpending": 200,
 *   "categorySpending": {
 *     "Food": 100,
 *     "Transport": 50,
 *     "Other": 50
 *   },
 *   "insights": "You spent most on Food this month."
 * }
 * Error Example:
 * {
 *   "error": "Missing required query parameters: startDate, endDate"
 * }
 */
router.get("/expenses/insights", authMiddleware, getSpendingInsights);

/**
 * Route to get all expenses for the authenticated user
 * GET /api/expenses
 * Response Example:
 * [
 *   {
 *     "amount": 20,
 *     "description": "Lunch at McDonald's",
 *     "category": "Food",
 *     "date": "2023-10-05",
 *     "user": "123",
 *     "_id": "456"
 *   },
 *   ...
 * ]
 * Error Example:
 * {
 *   "error": "Unauthorized. User ID is missing."
 * }
 */
router.get("/expenses", authMiddleware, getUserExpenses);

export default router;
