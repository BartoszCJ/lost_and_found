import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

export const validateRequest = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((err) => err.message);
      res.status(400).json({ errors });
      return; 
    }

    next(); 
  };
};
