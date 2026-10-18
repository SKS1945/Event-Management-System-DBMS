import { Response } from 'express';
import prisma from '../config/db.js';
import { AuthRequest } from '../middleware/auth.js';

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        department: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('getProfile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const { name, phone, department } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name: name.trim() }),
        ...(phone !== undefined && { phone: phone ? phone.trim() : null }),
        ...(department !== undefined && { department: department ? department.trim() : null }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        department: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('updateProfile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
