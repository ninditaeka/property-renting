import express from 'express';

import { getAllRoomFacilities } from '@/controllers/roomFacility.controller';

import { tenantGuard } from '@/middlewares/auth.middleware';
import { verifyToken } from '@/controllers/auth.controller';
const router = express.Router();

router.get('/', verifyToken, tenantGuard, getAllRoomFacilities);
export default router;
