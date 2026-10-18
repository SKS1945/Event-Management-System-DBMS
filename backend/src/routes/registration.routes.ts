import { Router } from 'express';
import {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
} from '../controllers/registration.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/my', authenticate, getMyRegistrations);
router.post('/:eventId', authenticate, registerForEvent);
router.delete('/:id', authenticate, cancelRegistration);

export default router;
