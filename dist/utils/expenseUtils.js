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
exports.getCategoryWiseSpending = exports.getTotalSpending = exports.getExpensesByTimePeriod = void 0;
const Expense_1 = __importDefault(require("../models/Expense"));
/**
 * Get expenses for a specific time period
 */
const getExpensesByTimePeriod = (userId, startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expenses = yield Expense_1.default.find({
            user: userId,
            date: { $gte: startDate, $lte: endDate },
        });
        return expenses;
    }
    catch (error) {
        console.error("Error fetching expenses by time period:", error);
        throw new Error("Failed to fetch expenses by time period");
    }
});
exports.getExpensesByTimePeriod = getExpensesByTimePeriod;
/**
 * Get total spending for a specific time period
 */
const getTotalSpending = (userId, startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expenses = yield (0, exports.getExpensesByTimePeriod)(userId, startDate, endDate);
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        return total;
    }
    catch (error) {
        console.error("Error calculating total spending:", error);
        throw new Error("Failed to calculate total spending");
    }
});
exports.getTotalSpending = getTotalSpending;
/**
 * Get category-wise spending for a specific time period
 */
const getCategoryWiseSpending = (userId, startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const expenses = yield (0, exports.getExpensesByTimePeriod)(userId, startDate, endDate);
        const categoryTotals = {};
        expenses.forEach((expense) => {
            if (categoryTotals[expense.category]) {
                categoryTotals[expense.category] += expense.amount;
            }
            else {
                categoryTotals[expense.category] = expense.amount;
            }
        });
        return categoryTotals;
    }
    catch (error) {
        console.error("Error calculating category-wise spending:", error);
        throw new Error("Failed to calculate category-wise spending");
    }
});
exports.getCategoryWiseSpending = getCategoryWiseSpending;
