import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let db: string | undefined = process.env.DB;

if (process.env.NODE_ENV === "test") {
  db = process.env.DB_TEST;
}

export const ConnectToDb = async (): Promise<void> => {
  if (db !== undefined) {
    try {
      await mongoose.connect(db);
      console.log(`[database] Connected to ${db} database successfully`);
    } catch (error) {
      console.error("[database error] MongoDB connection error:", error);
    }
  }
};
