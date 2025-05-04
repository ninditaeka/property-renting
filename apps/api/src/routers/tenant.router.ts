import express from 'express';
import { verifyToken } from '@/controllers/auth.controller';
import { authenticate, tenantGuard } from '@/middlewares/auth.middleware';
import {
  getPropertyByUserToken,
  getAllRoomInfoByUserToken,
  getPriceManagementDashboardByUserToken,
} from '@/controllers/tenant.controller';
const router = express.Router();

router.get('/my-property', verifyToken, tenantGuard, getPropertyByUserToken);

router.get('/my-rooms', verifyToken, tenantGuard, getAllRoomInfoByUserToken);

router.get(
  '/my-price',
  verifyToken,
  tenantGuard,
  getPriceManagementDashboardByUserToken,
);

export default router;
