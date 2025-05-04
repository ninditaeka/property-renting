import express from 'express';
import { getRoomTypewithFacilitiesLowestPriceandAvabilityByRoomTypeCode } from '@/controllers/roomDetail.controller';

const router = express.Router();
router.get(
  '/:roomTypeCode/with-facilities-lowest-price-and-availability',
  getRoomTypewithFacilitiesLowestPriceandAvabilityByRoomTypeCode,
);

export default router;
