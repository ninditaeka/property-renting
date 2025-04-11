import express from 'express';

import { getAllPropertyFacilities } from '@/controllers/propertyFacility.controller';

import { verifyToken } from '@/controllers/auth.controller';
const router = express.Router();

router.get('/', getAllPropertyFacilities);
export default router;
