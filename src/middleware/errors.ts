import { NextFunction, Request, Response } from "express";

export class AppError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(code: string, message: string, status = 400, details?: unknown) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

// Global error handler (must be mounted after all routes)
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  // Known AppError
  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: { code: err.code, message: err.message, details: err.details ?? null },
    });
  }

  // Zod error passed directly (fallback)
  const maybeZod = err as any;
  if (maybeZod?.issues) {
    return res.status(400).json({
      error: { code: "ValidationError", message: "Invalid request", details: maybeZod },
    });
  }

  // Unknown
  console.error("[UNHANDLED ERROR]", err);
  return res.status(500).json({
    error: { code: "InternalServerError", message: "Something went wrong" },
  });
}
