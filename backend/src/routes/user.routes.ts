import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/me', authenticate, getProfile);
router.put('/me', authenticate, updateProfile);

export default router;
