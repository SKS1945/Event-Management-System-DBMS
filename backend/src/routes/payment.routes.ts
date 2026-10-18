import { Router } from 'express';
import {
  createOrder,
  verifyPayment,
  getAllPayments,
} from '../controllers/payment.controller.js';
import { authenticate } from '../middleware/auth.js';
import { adminOnly } from '../middleware/adminOnly.js';

const router = Router();

router.post('/create-order', authenticate, createOrder);
router.post('/verify', authenticate, verifyPayment);
router.get('/', authenticate, adminOnly, getAllPayments);

export default router;
