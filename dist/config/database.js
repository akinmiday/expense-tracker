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
exports.disconnectFromDatabase = exports.connectToDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
// Get the MongoDB connection URI from environment variables
const MONGO_URI = process.env.MONGO_URI;
// Throw an error if MONGO_URI is not defined
if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined in the environment variables.");
}
/**
 * Connect to MongoDB using Mongoose
 */
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to the MongoDB database
        yield mongoose_1.default.connect(MONGO_URI);
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1); // Exit the process if the connection fails
    }
});
exports.connectToDatabase = connectToDatabase;
/**
 * Disconnect from MongoDB
 */
const disconnectFromDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.disconnect();
        console.log("Disconnected from MongoDB");
    }
    catch (error) {
        console.error("Failed to disconnect from MongoDB:", error);
    }
});
exports.disconnectFromDatabase = disconnectFromDatabase;
