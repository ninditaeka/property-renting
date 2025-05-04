import express from 'express';
import {
  createPropertyCategory,
  deletePropertyCategorybyPropertyCategoryCode,
  getAllPropertyCategory,
  getPropertyCategorybyPropertyCategoryCode,
  searchCategoryProperty,
  updatePropertyCategorybyPropertyCategoryCode,
} from '@/controllers/propertyCategory.controller';
import {
  createPropertyCategoryValidation,
  updatePropertyCategoryValidation,
  validateCreatePropertyCategory,
  validateUpdatePropertyCategory,
} from '@/middlewares/propertyCategoryValidation.middleware';
import { tenantGuard } from '@/middlewares/auth.middleware';
import { verifyToken } from '@/controllers/auth.controller';
const router = express.Router();

router.post(
  '/',
  verifyToken,
  tenantGuard,
  createPropertyCategoryValidation,
  validateCreatePropertyCategory,
  createPropertyCategory,
);

router.get('/', verifyToken, tenantGuard, getAllPropertyCategory);

router.get(
  '/:property_category_code',

  getPropertyCategorybyPropertyCategoryCode,
);

router.patch(
  '/:property_category_code',
  verifyToken,
  tenantGuard,
  updatePropertyCategoryValidation,
  validateUpdatePropertyCategory,
  updatePropertyCategorybyPropertyCategoryCode,
);

router.delete(
  '/:property_category_code',
  verifyToken,
  tenantGuard,
  deletePropertyCategorybyPropertyCategoryCode,
);

router.get('/', searchCategoryProperty);

export default router;
