import express from 'express';

import { getAllPropertyFacilities } from '@/controllers/propertyFacility.controller';
import { tenantGuard } from '@/middlewares/auth.middleware';
import { verifyToken } from '@/controllers/auth.controller';
const router = express.Router();

router.get('/', verifyToken, tenantGuard, getAllPropertyFacilities);
export default router;
