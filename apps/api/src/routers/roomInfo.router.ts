import express from 'express';

import { getAllRoomInfo } from '@/controllers/roomInfo.controller';

import { tenantGuard } from '@/middlewares/auth.middleware';
import { verifyToken } from '@/controllers/auth.controller';
const router = express.Router();

router.get('/', verifyToken, tenantGuard, getAllRoomInfo);
export default router;
