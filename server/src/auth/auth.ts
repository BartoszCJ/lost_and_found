import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Middleware do weryfikacji JWT
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Oczekiwany format: "Bearer TOKEN"

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Forbidden
            }

            (req as any).user = user; // Przypisanie użytkownika do obiektu żądania
            next();
        });
    } else {
        res.sendStatus(401); // Unauthorized
    }
};
