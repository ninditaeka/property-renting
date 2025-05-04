import express from 'express';
import {
  getRoomTypesByProperty,
  getPricesByRoomType,
  getRoomDetailByRoomNumberCode,
} from '@/controllers/roomManagement.controller';

import { tenantGuard } from '@/middlewares/auth.middleware';
import { verifyToken } from '@/controllers/auth.controller';
const router = express.Router();

router.get(
  '/property/:property_code/room-types',
  verifyToken,
  tenantGuard,
  getRoomTypesByProperty,
);

router.get(
  '/room-type/:room_type_code/prices',
  verifyToken,
  tenantGuard,
  getPricesByRoomType,
);

router.get(
  '/room-detail/:room_number_code',
  verifyToken,
  tenantGuard,
  getRoomDetailByRoomNumberCode,
);
export default router;
