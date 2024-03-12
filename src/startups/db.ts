import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const db: string | undefined = process.env.DB;

export const ConnectToDb = (): void => {
  if (db !== undefined) {
    mongoose
      .connect(db)
      .then(() => {
        console.log(`[database] Connected to MongoDB database successfully`);
      })
      .catch((error) => {
        console.error("[database error] MongoDB connection error:", error);
      });
  }
};
