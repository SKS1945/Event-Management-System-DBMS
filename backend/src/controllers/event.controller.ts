import { Response } from 'express';
import { Category, EventStatus, RegistrationStatus, PaymentStatus } from '@prisma/client';
import prisma from '../config/db.js';
import { AuthRequest } from '../middleware/auth.js';

// Public: Get all events with filtering and search
export const getAllEvents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category, status, search, sortBy } = req.query;

    const where: any = {};

    if (category && Object.values(Category).includes(category as Category)) {
      where.category = category as Category;
    }

    if (status && Object.values(EventStatus).includes(status as EventStatus)) {
      where.status = status as EventStatus;
    } else {
      // Default: don't show cancelled events to regular users unless specified
      if (!req.user || req.user.role !== 'ADMIN') {
        where.status = { not: EventStatus.CANCELLED };
      }
    }

    if (search && typeof search === 'string') {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { venue: { contains: search, mode: 'insensitive' } },
      ];
    }

    let orderBy: any = { date: 'asc' };
    if (sortBy === 'fee_asc') orderBy = { fee: 'asc' };
    if (sortBy === 'fee_desc') orderBy = { fee: 'desc' };
    if (sortBy === 'newest') orderBy = { createdAt: 'desc' };

    const events = await prisma.event.findMany({
      where,
      orderBy,
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: {
            registrations: {
              where: { status: { not: RegistrationStatus.CANCELLED } },
            },
          },
        },
      },
    });

    res.status(200).json({ events });
  } catch (error) {
    console.error('getAllEvents error:', error);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
};

// Public: Get single event by ID
export const getEventById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid event ID' });
      return;
    }

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
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

    // Check if current requesting user is registered
    let userRegistration = null;
    if (req.user) {
      userRegistration = await prisma.registration.findUnique({
        where: {
          userId_eventId: {
            userId: req.user.id,
            eventId: id,
          },
        },
        include: {
          payment: true,
        },
      });
    }

    res.status(200).json({ event, userRegistration });
  } catch (error) {
    console.error('getEventById error:', error);
    res.status(500).json({ message: 'Failed to fetch event details' });
  }
};

// Admin: Create Event
export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }

    const {
      title,
      description,
      venue,
      date,
      maxCapacity,
      fee,
      category,
      imageUrl,
      status,
    } = req.body;

    if (!title || !description || !venue || !date || !maxCapacity || !category) {
      res.status(400).json({ message: 'Required fields missing' });
      return;
    }

    if (!Object.values(Category).includes(category)) {
      res.status(400).json({ message: 'Invalid event category' });
      return;
    }

    const event = await prisma.event.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        venue: venue.trim(),
        date: new Date(date),
        maxCapacity: parseInt(maxCapacity, 10),
        fee: parseFloat(fee || 0),
        category,
        imageUrl: imageUrl ? imageUrl.trim() : null,
        status: status && Object.values(EventStatus).includes(status) ? status : EventStatus.UPCOMING,
        createdById: req.user.id,
      },
    });

    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    console.error('createEvent error:', error);
    res.status(500).json({ message: 'Failed to create event' });
  }
};

// Admin: Update Event
export const updateEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }

    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid event ID' });
      return;
    }

    const {
      title,
      description,
      venue,
      date,
      maxCapacity,
      fee,
      category,
      imageUrl,
      status,
    } = req.body;

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(description && { description: description.trim() }),
        ...(venue && { venue: venue.trim() }),
        ...(date && { date: new Date(date) }),
        ...(maxCapacity !== undefined && { maxCapacity: parseInt(maxCapacity, 10) }),
        ...(fee !== undefined && { fee: parseFloat(fee) }),
        ...(category && Object.values(Category).includes(category) && { category }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl ? imageUrl.trim() : null }),
        ...(status && Object.values(EventStatus).includes(status) && { status }),
      },
    });

    res.status(200).json({ message: 'Event updated successfully', event });
  } catch (error) {
    console.error('updateEvent error:', error);
    res.status(500).json({ message: 'Failed to update event' });
  }
};

// Admin: Delete / Cancel Event
export const deleteEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }

    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid event ID' });
      return;
    }

    // Soft delete: set status to CANCELLED
    const event = await prisma.event.update({
      where: { id },
      data: { status: EventStatus.CANCELLED },
    });

    res.status(200).json({ message: 'Event cancelled successfully', event });
  } catch (error) {
    console.error('deleteEvent error:', error);
    res.status(500).json({ message: 'Failed to cancel event' });
  }
};

// Admin: Get all registrations for a specific event
export const getEventRegistrations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }

    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid event ID' });
      return;
    }

    const registrations = await prisma.registration.findMany({
      where: { eventId: id },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, department: true },
        },
        payment: true,
      },
      orderBy: { registeredAt: 'desc' },
    });

    const event = await prisma.event.findUnique({
      where: { id },
      select: { id: true, title: true, maxCapacity: true, fee: true },
    });

    res.status(200).json({ event, registrations });
  } catch (error) {
    console.error('getEventRegistrations error:', error);
    res.status(500).json({ message: 'Failed to fetch registrations' });
  }
};

// Admin: Comprehensive Dashboard Statistics (SQL aggregates & JOINs)
export const getAdminDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }

    // Total counts
    const totalEvents = await prisma.event.count();
    const totalRegistrations = await prisma.registration.count({
      where: { status: { not: RegistrationStatus.CANCELLED } },
    });
    const activeUsers = await prisma.user.count({
      where: { role: 'USER' },
    });

    // Total revenue from successful payments (DBMS SQL SUM)
    const revenueAgg = await prisma.payment.aggregate({
      where: { status: PaymentStatus.SUCCESS },
      _sum: { amount: true },
    });
    const totalRevenue = Number(revenueAgg._sum.amount || 0);

    // Registrations per Category (GROUP BY demonstration)
    const eventsWithCategory = await prisma.event.findMany({
      select: {
        category: true,
        _count: {
          select: {
            registrations: {
              where: { status: { not: RegistrationStatus.CANCELLED } },
            },
          },
        },
      },
    });

    const categoryCounts: Record<Category, number> = {
      TECH: 0,
      CULTURAL: 0,
      WORKSHOP: 0,
      INFORMALS: 0,
    };

    eventsWithCategory.forEach((e) => {
      categoryCounts[e.category] = (categoryCounts[e.category] || 0) + e._count.registrations;
    });

    // Recent registrations
    const recentRegistrations = await prisma.registration.findMany({
      take: 6,
      orderBy: { registeredAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true, department: true } },
        event: { select: { id: true, title: true, category: true, fee: true } },
        payment: true,
      },
    });

    // Recent events with registration counts
    const recentEvents = await prisma.event.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
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

    res.status(200).json({
      stats: {
        totalEvents,
        totalRegistrations,
        totalRevenue,
        activeUsers,
        categoryCounts,
        recentRegistrations,
        recentEvents,
      },
    });
  } catch (error) {
    console.error('getAdminDashboardStats error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard statistics' });
  }
};
