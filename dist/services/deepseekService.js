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
exports.generateSpendingInsights = exports.analyzeExpense = void 0;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const MODEL_NAME = process.env.DEEPSEEK_MODEL || "deepseek-chat";
if (!DEEPSEEK_API_KEY) {
    throw new Error("DEEPSEEK_API_KEY is not defined in the environment variables.");
}
const openai = new openai_1.default({
    baseURL: "https://api.deepseek.com",
    apiKey: DEEPSEEK_API_KEY,
});
/**
 * Analyze expense description using DeepSeek API
 * @param description - The expense description (e.g., "Lunch at McDonald's")
 * @returns Analysis result (e.g., category, insights)
 */
const analyzeExpense = (description) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const completion = yield openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful financial assistant. Analyze the expense description and provide a category.",
                },
                {
                    role: "user",
                    content: `Categorize this expense: "${description}". Return a JSON object with a "category" field.`,
                },
            ],
            model: MODEL_NAME,
        });
        // Ensure response is not null
        const response = (_a = completion.choices[0]) === null || _a === void 0 ? void 0 : _a.message.content;
        if (!response) {
            throw new Error("Empty response from DeepSeek API");
        }
        // Log the raw response content
        console.log("Raw response from DeepSeek:", response);
        // Remove markdown syntax and attempt to parse the JSON
        const cleanedResponse = response.replace(/^```json\s|\s```$/g, "").trim();
        try {
            return JSON.parse(cleanedResponse || '{"category": "Uncategorized"}');
        }
        catch (parseError) {
            console.error("Error parsing JSON response:", parseError);
            throw new Error("Invalid JSON response from DeepSeek API");
        }
    }
    catch (error) {
        console.error("DeepSeek API error:", error);
        throw new Error("Failed to analyze expense description");
    }
});
exports.analyzeExpense = analyzeExpense;
/**
 * Generate spending insights using DeepSeek API
 */
const generateSpendingInsights = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const completion = yield openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful financial assistant. Analyze the spending data and provide insights and recommendations.",
                },
                {
                    role: "user",
                    content: `Here is my spending data for ${data.timePeriod}: Total spending: $${data.totalSpending}. Category-wise spending: ${JSON.stringify(data.categorySpending)}. Provide insights and recommendations. response should be valid JSON.`,
                },
            ],
            model: MODEL_NAME,
        });
        return completion.choices[0].message.content || "No insights available.";
    }
    catch (error) {
        console.error("DeepSeek API error:", error);
        throw new Error("Failed to generate spending insights");
    }
});
exports.generateSpendingInsights = generateSpendingInsights;
