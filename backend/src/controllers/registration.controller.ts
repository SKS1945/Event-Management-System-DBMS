import { Response } from 'express';
import { RegistrationStatus, PaymentStatus, EventStatus } from '@prisma/client';
import prisma from '../config/db.js';
import { AuthRequest } from '../middleware/auth.js';

// User registers for an event
export const registerForEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const eventId = parseInt(req.params.eventId as string, 10);
    if (isNaN(eventId)) {
      res.status(400).json({ message: 'Invalid event ID' });
      return;
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: {
            registrations: {
              where: { status: { not: RegistrationStatus.CANCELLED } },
            },
          },
        },
      },
    });

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    if (event.status === EventStatus.CANCELLED) {
      res.status(400).json({ message: 'This event has been cancelled by the administration' });
      return;
    }

    if (event.status === EventStatus.COMPLETED) {
      res.status(400).json({ message: 'This event has already ended' });
      return;
    }

    // Capacity constraint check (DBMS constraint check)
    const activeRegistrations = event._count.registrations;
    if (activeRegistrations >= event.maxCapacity) {
      res.status(400).json({ message: 'Registration full: Maximum capacity reached' });
      return;
    }

    // Check if user is already registered (Unique constraint check)
    const existingRegistration = await prisma.registration.findUnique({
      where: {
        userId_eventId: {
          userId: req.user.id,
          eventId,
        },
      },
      include: { payment: true },
    });

    if (existingRegistration) {
      if (existingRegistration.status !== RegistrationStatus.CANCELLED) {
        res.status(400).json({
          message: 'You are already registered for this event',
          registration: existingRegistration,
        });
        return;
      }

      // If previously cancelled, re-activate registration
      const newStatus =
        Number(event.fee) === 0 ? RegistrationStatus.CONFIRMED : RegistrationStatus.PENDING;

      const reactivated = await prisma.registration.update({
        where: { id: existingRegistration.id },
        data: {
          status: newStatus,
          registeredAt: new Date(),
        },
        include: {
          event: true,
          payment: true,
        },
      });

      res.status(200).json({
        message: 'Registration re-activated successfully',
        registration: reactivated,
      });
      return;
    }

    // Free event -> CONFIRMED immediately. Paid event -> PENDING until payment
    const initialStatus =
      Number(event.fee) === 0 ? RegistrationStatus.CONFIRMED : RegistrationStatus.PENDING;

    const registration = await prisma.registration.create({
      data: {
        userId: req.user.id,
        eventId,
        status: initialStatus,
      },
      include: {
        event: true,
        payment: true,
      },
    });

    res.status(201).json({
      message:
        Number(event.fee) === 0
          ? 'Registered successfully! Your spot is confirmed.'
          : 'Registration initiated! Please proceed with payment to confirm your spot.',
      registration,
    });
  } catch (error) {
    console.error('registerForEvent error:', error);
    res.status(500).json({ message: 'Failed to complete registration' });
  }
};

// Get current user's registrations
export const getMyRegistrations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const registrations = await prisma.registration.findMany({
      where: { userId: req.user.id },
      include: {
        event: {
          include: {
            createdBy: {
              select: { name: true, email: true },
            },
          },
        },
        payment: true,
      },
      orderBy: { registeredAt: 'desc' },
    });

    res.status(200).json({ registrations });
  } catch (error) {
    console.error('getMyRegistrations error:', error);
    res.status(500).json({ message: 'Failed to fetch your registrations' });
  }
};

// Cancel registration
export const cancelRegistration = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid registration ID' });
      return;
    }

    const registration = await prisma.registration.findUnique({
      where: { id },
      include: { payment: true, event: true },
    });

    if (!registration) {
      res.status(404).json({ message: 'Registration not found' });
      return;
    }

    // Ensure user owns this registration unless admin
    if (registration.userId !== req.user.id && req.user.role !== 'ADMIN') {
      res.status(403).json({ message: 'Unauthorized to cancel this registration' });
      return;
    }

    if (registration.status === RegistrationStatus.CANCELLED) {
      res.status(400).json({ message: 'Registration is already cancelled' });
      return;
    }

    // Cancel registration and mark payment refunded if it was paid
    const updated = await prisma.$transaction(async (tx) => {
      const reg = await tx.registration.update({
        where: { id },
        data: { status: RegistrationStatus.CANCELLED },
        include: { event: true, payment: true },
      });

      if (reg.payment && reg.payment.status === PaymentStatus.SUCCESS) {
        await tx.payment.update({
          where: { id: reg.payment.id },
          data: { status: PaymentStatus.REFUNDED },
        });
      }

      return reg;
    });

    res.status(200).json({
      message: 'Registration cancelled successfully',
      registration: updated,
    });
  } catch (error) {
    console.error('cancelRegistration error:', error);
    res.status(500).json({ message: 'Failed to cancel registration' });
  }
};
