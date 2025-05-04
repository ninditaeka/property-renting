import express from 'express';
import { getPriceManagement } from '@/controllers/priceManagement.controller';
import { getRoomNumbersByRoomType } from '@/controllers/priceManagement.controller';
import { tenantGuard } from '@/middlewares/auth.middleware';
import { verifyToken } from '@/controllers/auth.controller';
const router = express.Router();
//Router to get all data table in price maanagement
router.get('/', verifyToken, tenantGuard, getPriceManagement);
// Route to get room numbers by room type code
router.get(
  '/room-type/:room_type_code',
  verifyToken,
  tenantGuard,
  getRoomNumbersByRoomType,
);

export default router;
