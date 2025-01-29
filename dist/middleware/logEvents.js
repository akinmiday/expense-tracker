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
exports.logger = exports.logEvents = void 0;
const date_fns_1 = require("date-fns");
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
// Define the log function to accept a message and log name
const logEvents = (message, logName) => __awaiter(void 0, void 0, void 0, function* () {
    const dateTime = `${(0, date_fns_1.format)(new Date(), "ddMMyyyy  \tHH:mm:ss")}`;
    const logItem = `${dateTime}\t${(0, uuid_1.v4)()}\t${message}\n`;
    console.log(logItem);
    try {
        // Ensure logs directory exists
        const logDir = path_1.default.join(__dirname, "..", "logs");
        if (!fs_1.default.existsSync(logDir)) {
            yield promises_1.default.mkdir(logDir);
        }
        // Append the log message to the respective log file
        yield promises_1.default.appendFile(path_1.default.join(logDir, logName), logItem);
    }
    catch (error) {
        console.error("Error logging events:", error);
    }
});
exports.logEvents = logEvents;
// Define the middleware logger
const logger = (req, res, next) => {
    // Safely access the origin header
    const origin = req.headers.origin || "unknown"; // If 'origin' doesn't exist, use 'unknown'
    (0, exports.logEvents)(`${req.method}\t${origin}\t${req.url}`, "reqLog.txt");
    console.log(`${req.method} ${req.path}`);
    next(); // Move to the next middleware or route handler
};
exports.logger = logger;
