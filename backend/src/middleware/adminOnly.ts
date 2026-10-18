import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';

export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  if (req.user.role !== 'ADMIN') {
    res.status(403).json({ message: 'Access denied: Admin privileges required' });
    return;
  }

  next();
};
