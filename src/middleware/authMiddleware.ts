import { type Request, type Response, type NextFunction } from "express";
import jwt, { type JwtPayload, type Secret } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface AuthRequest extends Request {
  user?: JwtPayload;
}

export default function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Response<any, Record<string, any>> | undefined | NextFunction {
  const authHeader = req.headers.authorization;

  if (authHeader === undefined) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const [bearer, token] = authHeader.split(" ");

  if (bearer !== "Bearer" || token === undefined) {
    return res
      .status(401)
      .json({ error: "Invalid authorization header format." });
  }

  if (token !== undefined) {
    try {
      jwt.verify(token, process.env.JWT_ACCESS_KEY as Secret, (err, user) => {
        if (err !== null) {
          return res.status(403).json({ error: "Access denied" });
        }
        if (user !== undefined) {
          req.user = user as JwtPayload;
          next();
        }
      });
    } catch (ex) {
      return res.status(401).json({ error: "Invalid token" });
    }
  }
}
