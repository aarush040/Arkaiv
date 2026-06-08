import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction): void {
  console.error('[Error]', err);

  if (err.name === 'ValidationError') {
    res.status(400).json({ error: err.message });
    return;
  }

  if (err.code === 11000) {
    res.status(409).json({ error: 'Duplicate key error. Resource already exists.' });
    return;
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
}