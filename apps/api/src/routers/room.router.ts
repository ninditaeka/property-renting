import express from 'express';
import { tenantGuard } from '@/middlewares/auth.middleware';
import { verifyToken } from '@/controllers/auth.controller';
import {
  createRoom,
  deleteRoomNumberbyRoomNumberCode,
  getAllRoom,
  getRoombyRoomNumberCode,
  updateRoombyRoomNumberCode,
} from '@/controllers/room.controller';
import {
  createRoomValidation,
  updateRoomValidation,
  validateCreateRoom,
  validateUpdateRoom,
} from '@/middlewares/roomValidatation.middleware';
import { deletePropertybyPropertyCode } from '@/controllers/propertyList.controller';

const router = express.Router();

router.post(
  '/',
  verifyToken,
  tenantGuard,
  createRoomValidation,
  validateCreateRoom,
  createRoom,
);

router.get('/', verifyToken, tenantGuard, getAllRoom);

router.get('/:room_number_code', getRoombyRoomNumberCode);

router.patch(
  '/:room_number_code',
  verifyToken,
  tenantGuard,
  updateRoomValidation,
  validateUpdateRoom,
  updateRoombyRoomNumberCode,
);

router.delete(
  '/:room_number_code',
  verifyToken,
  tenantGuard,
  deleteRoomNumberbyRoomNumberCode,
);
export default router;
