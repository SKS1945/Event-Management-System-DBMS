import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';

export interface TokenPayload {
  id: number;
  email: string;
  role: Role;
  name: string;
}

export const generateToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET || 'fallback_secret_for_dev_mode';
  return jwt.sign(payload, secret, {
    expiresIn: '7d',
  });
};
