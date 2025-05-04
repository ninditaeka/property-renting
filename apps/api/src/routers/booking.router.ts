import { verifyToken } from '@/controllers/auth.controller';
import {
  createBooking,
  getBookingsByUserCode,
  getRoomPricingByDateRangebyRoomTypeCode,
  getRoomNumberinBookingByRoomTypeCode,
  getRoomNumberSelectedByRoomTypeCodeLowestPrice,
} from '@/controllers/booking.controller';
import { customerrGuard } from '@/middlewares/auth.middleware';
import {
  createBookingValidation,
  validateCreateBooking,
} from '@/middlewares/bookingValidation.middleware';
import express from 'express';

const router = express.Router();
//
router.post(
  '/',
  verifyToken,
  customerrGuard,
  createBookingValidation,
  validateCreateBooking,
  createBooking,
);

// router.get('/pricing/:room_type_code', getRoomPricingByDateRangebyRoomTypeCode);
router.get(
  '/selected-room-available-lowest-price/:room_type_code',
  getRoomNumberSelectedByRoomTypeCodeLowestPrice,
);
router.get(
  '/room-pricing/:room_type_code',
  getRoomPricingByDateRangebyRoomTypeCode,
);

// Route with both room_type_code and room_number as parameters
router.get(
  '/room-pricing/:room_type_code/:room_number',
  getRoomPricingByDateRangebyRoomTypeCode,
);

router.get('/selected-available-rooms', getRoomNumberinBookingByRoomTypeCode);
//
router.get('/:user_code', verifyToken, customerrGuard, getBookingsByUserCode);
export default router;
