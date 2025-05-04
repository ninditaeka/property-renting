import { verifyToken } from '@/controllers/auth.controller';
import { getDataCustomerbyUserCode } from '@/controllers/customer.controller';
import { customerrGuard } from '@/middlewares/auth.middleware';
import express from 'express';

const router = express.Router();
router.get(
  '/:user_code',
  verifyToken,
  customerrGuard,
  getDataCustomerbyUserCode,
);

export default router;
