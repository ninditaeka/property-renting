import express from 'express';
import {
  getPropertyWithRoomTypesByCode,
  getPropertyWithFacilitiesByCode,
  getPropertyDetailByCodeWithRoomDetailAvailabilityFacilitiesAndLowerPrice,
} from '@/controllers/propertyDetail.controller';
const router = express.Router();
router.get('/:propertyCode/with-room-types', getPropertyWithRoomTypesByCode);
router.get('/:propertyCode/with-facilities', getPropertyWithFacilitiesByCode);
router.get(
  '/:propertyCode/with-room-availability-lower-price',
  getPropertyDetailByCodeWithRoomDetailAvailabilityFacilitiesAndLowerPrice,
);
export default router;
