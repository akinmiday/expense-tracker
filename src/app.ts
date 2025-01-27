import express from "express";
import cors from "cors";
import expenseRoutes from "./routes/expenseRoutes";
import userRoutes from "./routes/userRoutes";
import { connectToDatabase } from "./config/database";
import { corsOptions } from "./config/corOptions";
import cookieParser from "cookie-parser";
import { logger } from "./middleware/logEvents";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Log incoming requests
app.use(logger);

// Routes
app.use("/api", userRoutes);
app.use("/api", expenseRoutes);

// Connect to MongoDB
connectToDatabase();

// Error handling middleware (should be after routes)
app.use(errorHandler);

export default app;
