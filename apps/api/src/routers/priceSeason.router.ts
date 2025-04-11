import express from 'express';
import { tenantGuard } from '@/middlewares/auth.middleware';
import { verifyToken } from '@/controllers/auth.controller';
import {
  createPriceSeason,
  getAllPriceSeason,
} from '@/controllers/priceSeason.controller';
import {
  createPriceSeasonValidation,
  validateCreatePriceSeason,
} from '@/middlewares/priceSeasonValidation.middleware';
const router = express.Router();

router.post(
  '/',
  verifyToken,
  tenantGuard,
  createPriceSeasonValidation,
  validateCreatePriceSeason,
  createPriceSeason,
);

router.get('/', verifyToken, tenantGuard, getAllPriceSeason);

export default router;
