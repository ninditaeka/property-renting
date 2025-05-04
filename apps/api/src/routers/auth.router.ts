import express from 'express';
import {
  startRegistration,
  tenantRegister,
  customerRegister,
  googleAuth,
  requestProfileCompletion,
  resendVerification,
  verifyToken,
  checkAccountType,
  linkGoogleAccount,
  loginProcess,
} from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import {
  validateStartRegistration,
  // validateVerifyToken,
  validateCustomerProfileCompletion,
  validateTenantProfileCompletion,
  logInValidate,
} from '../middlewares/authValidation';

const router = express.Router();

// Registration routes
router.post('/register', validateStartRegistration, startRegistration);
router.post(
  '/register/customer',
  validateCustomerProfileCompletion,
  customerRegister,
);
router.post(
  '/register/tenant',
  validateTenantProfileCompletion,
  tenantRegister,
);
router.post('/login', logInValidate, loginProcess);

// router.post('/register/google', googleAuth); // Google auth mungkin memerlukan validasi khusus

// Verification routes
// router.get('/verify', verifyToken);
// router.post(
//   '/resend-verification',
//   validateStartRegistration,
//   resendVerification,
// );

// Profile completion for Google users
// router.post('/request-profile-completion', requestProfileCompletion);

// Account type check
// router.get('/account-type', checkAccountType);

// Link Google account (requires authentication)
// router.post('/link-google/:userId', authenticate, linkGoogleAccount);

export default router;
