import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const MODEL_NAME = process.env.DEEPSEEK_MODEL || "deepseek-chat";

if (!DEEPSEEK_API_KEY) {
  throw new Error(
    "DEEPSEEK_API_KEY is not defined in the environment variables."
  );
}

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: DEEPSEEK_API_KEY,
});

/**
 * Analyze expense description using DeepSeek API
 * @param description - The expense description (e.g., "Lunch at McDonald's")
 * @returns Analysis result (e.g., category, insights)
 */

export const analyzeExpense = async (description: string) => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful financial assistant. Analyze the expense description and provide a category.",
        },
        {
          role: "user",
          content: `Categorize this expense: "${description}". Return a JSON object with a "category" field.`,
        },
      ],
      model: MODEL_NAME,
    });

    // Ensure response is not null
    const response = completion.choices[0]?.message.content;

    if (!response) {
      throw new Error("Empty response from DeepSeek API");
    }

    // Log the raw response content
    console.log("Raw response from DeepSeek:", response);

    // Remove markdown syntax and attempt to parse the JSON
    const cleanedResponse = response.replace(/^```json\s|\s```$/g, "").trim();
    try {
      return JSON.parse(cleanedResponse || '{"category": "Uncategorized"}');
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      throw new Error("Invalid JSON response from DeepSeek API");
    }
  } catch (error) {
    console.error("DeepSeek API error:", error);
    throw new Error("Failed to analyze expense description");
  }
};

/**
 * Generate spending insights using DeepSeek API
 */
export const generateSpendingInsights = async (data: {
  totalSpending: number;
  categorySpending: { [key: string]: number };
  timePeriod: string;
}): Promise<string> => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful financial assistant. Analyze the spending data and provide insights and recommendations.",
        },
        {
          role: "user",
          content: `Here is my spending data for ${
            data.timePeriod
          }: Total spending: $${
            data.totalSpending
          }. Category-wise spending: ${JSON.stringify(
            data.categorySpending
          )}. Provide insights and recommendations.`,
        },
      ],
      model: MODEL_NAME,
    });

    return completion.choices[0].message.content || "No insights available.";
  } catch (error) {
    console.error("DeepSeek API error:", error);
    throw new Error("Failed to generate spending insights");
  }
};
