import express from 'express';
import {
  getPropertyWithRoomTypesByCode,
  getPropertyWithFacilitiesByCode,
} from '@/controllers/propertyDetail.controller';
const router = express.Router();
router.get('/:propertyCode/with-room-types', getPropertyWithRoomTypesByCode);
router.get('/:propertyCode/with-facilities', getPropertyWithFacilitiesByCode);
export default router;
