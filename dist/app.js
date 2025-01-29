"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const expenseRoutes_1 = __importDefault(require("./routes/expenseRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const database_1 = require("./config/database");
const corOptions_1 = require("./config/corOptions");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const logEvents_1 = require("./middleware/logEvents");
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)(corOptions_1.corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Log incoming requests
app.use(logEvents_1.logger);
// Routes
app.use("/api", userRoutes_1.default);
app.use("/api", expenseRoutes_1.default);
// Connect to MongoDB
(0, database_1.connectToDatabase)();
// Error handling middleware (should be after routes)
app.use(errorHandler_1.errorHandler);
exports.default = app;
