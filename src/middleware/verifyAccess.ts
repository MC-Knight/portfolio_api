import { type Request, type Response, type NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

interface AuthRequest extends Request {
  user?: Record<string, any>;
}

export default function isAdminMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Response<any, Record<string, any>> | undefined | NextFunction {
  const user = req.user;

  if (user === undefined) {
    return res.status(401).json({ error: "Access denied." });
  }

  if (user.isAdmin === false) {
    return res.status(403).json({ error: "Forbidden." });
  } else {
    next();
  }
}
