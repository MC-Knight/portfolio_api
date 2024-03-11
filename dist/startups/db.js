"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectToDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db = process.env.DB;
const ConnectToDb = () => {
    if (db) {
        mongoose_1.default
            .connect(db)
            .then(() => {
            console.log(`[database] Connected to MongoDB database successfully`);
        })
            .catch((error) => {
            console.error("[database error] MongoDB connection error:", error);
        });
    }
};
exports.ConnectToDb = ConnectToDb;
