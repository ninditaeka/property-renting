import { verifyToken } from '@/controllers/auth.controller';
import {
  createBooking,
  getBookingsByUserCode,
} from '@/controllers/booking.controller';
import { customerrGuard } from '@/middlewares/auth.middleware';
import {
  createBookingValidation,
  validateCreateBooking,
} from '@/middlewares/bookingValidation.middleware';
import express from 'express';

const router = express.Router();

router.post(
  '/',
  verifyToken,
  customerrGuard,
  createBookingValidation,
  validateCreateBooking,
  createBooking,
);

router.get('/:user_code', verifyToken, customerrGuard, getBookingsByUserCode);
export default router;
