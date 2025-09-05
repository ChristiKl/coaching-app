import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { AppError } from "./errors";

type Source = "body" | "query" | "params";

export function validate<T extends ZodSchema>(schema: T, source: Source = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    const data = (req as any)[source];
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      throw new AppError("ValidationError", "Invalid request", 400, parsed.error.flatten());
    }
    // Replace with parsed data so downstream is clean
    (req as any)[source] = parsed.data;
    next();
  };
}
