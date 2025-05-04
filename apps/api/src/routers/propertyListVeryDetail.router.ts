import express from 'express';
import { PropertyListVeryDetail } from '@/controllers/propertyListVeryDetail.controller';
const router = express.Router();
router.get('/', PropertyListVeryDetail);
export default router;
