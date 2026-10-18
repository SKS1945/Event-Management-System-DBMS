import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TokenPayload } from '../utils/generateToken.js';

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Authorization token required' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'fallback_secret_for_dev_mode';

    const decoded = jwt.verify(token, secret) as TokenPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
