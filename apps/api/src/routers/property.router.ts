import express from 'express';
import {
  createProperty,
  deletePropertybyPropertyCode,
  getAllProperty,
  getAvailableRoomTypesByPropertyCode,
  getDetailedPropertiesByCity,
  getPropertybyPropertyCode,
  updatePropertybyPropertyCode,
} from '@/controllers/propertyList.controller';
import {
  createPropertyValidation,
  updatePropertyValidation,
  validateCreateProperty,
  validateUpdateProperty,
} from '@/middlewares/propertyValidation.middleware';
import { tenantGuard } from '@/middlewares/auth.middleware';
import { verifyToken } from '@/controllers/auth.controller';

const router = express.Router();
router.post(
  '/',
  verifyToken,
  tenantGuard,
  createPropertyValidation,
  validateCreateProperty,
  createProperty,
);

router.get('/available-room-types', getAvailableRoomTypesByPropertyCode);
router.get('/search', getDetailedPropertiesByCity);
router.get('/', verifyToken, tenantGuard, getAllProperty);

router.get('/:property_code', getPropertybyPropertyCode);

router.patch(
  '/:property_code',
  verifyToken,
  tenantGuard,
  updatePropertyValidation,
  validateUpdateProperty,
  updatePropertybyPropertyCode,
);

router.delete(
  '/:property_code',
  verifyToken,
  tenantGuard,
  deletePropertybyPropertyCode,
);

export default router;
