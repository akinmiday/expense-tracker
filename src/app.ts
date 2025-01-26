import express from "express";
import cors from "cors";
import expenseRoutes from "./routes/expenseRoutes";
import userRoutes from "./routes/userRoutes";
import { connectToDatabase } from "./config/database";
import { corsOptions } from "./config/corOptions";

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api", userRoutes);
app.use("/api", expenseRoutes);

// Connect to MongoDB
connectToDatabase();

export default app;
