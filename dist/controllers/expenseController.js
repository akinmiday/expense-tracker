"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserExpenses = exports.getPreviousInsights = exports.getSpendingInsights = exports.addExpense = void 0;
const Expense_1 = __importDefault(require("../models/Expense"));
const Insights_1 = __importDefault(require("../models/Insights"));
const deepseekService_1 = require("../services/deepseekService");
const expenseUtils_1 = require("../utils/expenseUtils");
/**
 * Add a new expense
 */
const addExpense = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const analysis = yield (0, deepseekService_1.analyzeExpense)(description);
        // Create a new expense
        const expense = new Expense_1.default({
            amount,
            description,
            category: analysis.category || "Uncategorized",
            date: date || new Date(),
            user: userId,
        });
        // Save the expense to the database
        yield expense.save();
        // Return the created expense
        res.status(201).json(expense);
    }
    catch (error) {
        console.error("Error adding expense:", {
            error,
            userId,
            requestBody: req.body,
        });
        res
            .status(500)
            .json({ error: "Failed to add expense. Please try again later." });
    }
});
exports.addExpense = addExpense;
/**
 * Get spending insights for a specific time period
 */
const getSpendingInsights = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const totalSpending = yield (0, expenseUtils_1.getTotalSpending)(userId, new Date(startDate), new Date(endDate));
        const categorySpending = yield (0, expenseUtils_1.getCategoryWiseSpending)(userId, new Date(startDate), new Date(endDate));
        // Generate insights using DeepSeek API
        const insights = yield (0, deepseekService_1.generateSpendingInsights)({
            totalSpending,
            categorySpending,
            timePeriod: `${startDate} to ${endDate}`,
        });
        // Save insights to the database
        const insight = new Insights_1.default({
            user: userId,
            timePeriod: `${startDate} to ${endDate}`,
            insights,
            totalSpending,
            categorySpending,
        });
        yield insight.save();
        // Return the insights
        res.status(200).json({ totalSpending, categorySpending, insights });
    }
    catch (error) {
        console.error("Error fetching spending insights:", {
            error,
            userId,
            requestBody: req.body,
        });
        res.status(500).json({
            error: "Failed to fetch spending insights. Please try again later.",
        });
    }
});
exports.getSpendingInsights = getSpendingInsights;
/**
 * Get all previous insights for the authenticated user.
 */
const getPreviousInsights = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ error: "Unauthorized. User ID is missing." });
        return;
    }
    try {
        // Fetch all insights for the authenticated user
        const insights = yield Insights_1.default.find({ user: userId }).sort({
            createdAt: -1,
        });
        // Return the insights
        res.status(200).json(insights);
    }
    catch (error) {
        console.error("Error fetching previous insights:", { error, userId });
        res.status(500).json({
            error: "Failed to fetch previous insights. Please try again later.",
        });
    }
});
exports.getPreviousInsights = getPreviousInsights;
/**
 * Get all expenses for the authenticated user
 */
const getUserExpenses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ error: "Unauthorized. User ID is missing." });
        return;
    }
    try {
        // Fetch all expenses for the authenticated user
        const expenses = yield Expense_1.default.find({ user: userId }).sort({ date: -1 }); // Sort by date in descending order
        // Return the expenses
        res.status(200).json(expenses);
    }
    catch (error) {
        console.error("Error fetching user expenses:", { error, userId });
        res.status(500).json({
            error: "Failed to fetch user expenses. Please try again later.",
        });
    }
});
exports.getUserExpenses = getUserExpenses;
