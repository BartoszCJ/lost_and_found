import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string;
      };
    }
  }
}
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization token missing or invalid." });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token." });
    }

    req.user = user as { id: number; email: string; role: string }; // Typowanie usera
    next();
  });
};
