import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ConnectToDb } from "./startups/db";
import { addRoutes } from "./startups/routes";
import { addDocumentation } from "./startups/docs";
import { getPort } from "./startups/getPort";

dotenv.config();

const app: Express = express();

let port = getPort();

if (process.env.NODE_ENV === "test") {
  port = Math.floor(Math.random() * 60000) + 5000;
}

ConnectToDb();

app.use(cors({ origin: "*" }));
addRoutes(app);
addDocumentation(app);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "my brand api" });
});

const server = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export { server };
