import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Get the MongoDB connection URI from environment variables
const MONGO_URI = process.env.MONGO_URI;

// Throw an error if MONGO_URI is not defined
if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in the environment variables.");
}

/**
 * Connect to MongoDB using Mongoose
 */
export const connectToDatabase = async () => {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1); // Exit the process if the connection fails
  }
};

/**
 * Disconnect from MongoDB
 */
export const disconnectFromDatabase = async () => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Failed to disconnect from MongoDB:", error);
  }
};
