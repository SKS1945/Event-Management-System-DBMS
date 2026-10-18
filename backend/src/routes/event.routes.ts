import { Router } from 'express';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventRegistrations,
  getAdminDashboardStats,
} from '../controllers/event.controller.js';
import { authenticate } from '../middleware/auth.js';
import { adminOnly } from '../middleware/adminOnly.js';

const router = Router();

// Public routes (with optional auth)
router.get('/', (req, res, next) => {
  if (req.headers.authorization) {
    return authenticate(req, res, next);
  }
  next();
}, getAllEvents);

// Admin dashboard statistics (must be before /:id)
router.get('/admin/stats', authenticate, adminOnly, getAdminDashboardStats);

router.get('/:id', (req, res, next) => {
  if (req.headers.authorization) {
    return authenticate(req, res, next);
  }
  next();
}, getEventById);

// Admin-only CRUD operations
router.post('/', authenticate, adminOnly, createEvent);
router.put('/:id', authenticate, adminOnly, updateEvent);
router.delete('/:id', authenticate, adminOnly, deleteEvent);
router.get('/:id/registrations', authenticate, adminOnly, getEventRegistrations);

export default router;
