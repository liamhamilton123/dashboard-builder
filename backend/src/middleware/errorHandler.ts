import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class AppError extends Error implements ApiError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  // Log error (but never log sensitive data)
  console.error('[Error]', {
    message: err.message,
    statusCode,
    path: req.path,
    method: req.method,
    ...(env.nodeEnv === 'development' && { stack: err.stack }),
  });

  // Send error response (never expose stack traces in production)
  res.status(statusCode).json({
    error: {
      message,
      ...(env.nodeEnv === 'development' && { stack: err.stack }),
    },
  });
}

export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const error = new AppError(`Not found - ${req.originalUrl}`, 404);
  next(error);
}
