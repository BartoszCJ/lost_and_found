import { Request, Response, NextFunction } from 'express';

export const authorizeRole = (requiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
      const user = (req as any).user;

      if (!user) {
          res.status(401).json({ error: "Unauthorized: No token provided" });
          return; 
      }

      if (!requiredRoles.includes(user.role)) {
          res.status(403).json({ error: "Forbidden: Insufficient permissions" });
          return; 
      }

      next(); 
  };
};
