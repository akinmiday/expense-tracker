import express from "express";
import {
  addExpense,
  getSpendingInsights,
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
 *   "date": "2023-10-05",
 *   "userId": "123"
 * }
 */
router.post("/expenses", authMiddleware, addExpense);

/**
 * Route to get spending insights for a specific time period
 * POST /api/expenses/insights
 * Request Body:
 * {
 *   "userId": "123",
 *   "startDate": "2023-10-01",
 *   "endDate": "2023-10-31"
 * }
 */
router.post("/expenses/insights", authMiddleware, getSpendingInsights);

export default router;
