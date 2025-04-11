import {
  validationResult,
  ValidationError,
  body,
  ValidationChain,
} from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Handle validation errors
const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
): void | Response => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err: ValidationError) => ({
        field:
          'path' in err ? err.path : 'param' in err ? err.param : 'unknown',
        message: err.msg,
      })),
    });
  }
  next();
};

// Create a middleware creator function to avoid TS errors with the handler
const createValidationMiddleware = (validations: ValidationChain[]) => {
  return [
    ...validations,
    (req: Request, res: Response, next: NextFunction) =>
      handleValidationErrors(req, res, next),
  ];
};

// Initial email registration validation
export const validateStartRegistration = createValidationMiddleware([
  body('email', 'Please provide a valid email').isEmail().normalizeEmail(),
]);

export const validateTenantProfileCompletion: ValidationChain[] = [
  body('password', 'Password must be at least 6 characters').isLength({
    min: 6,
  }),
  body('name', 'Name is required').notEmpty(),
  body('photo').optional(),
  body('email', 'Email is required').notEmpty(),
  body('address', 'Address is required').notEmpty(),
  body('gender', 'Gender is required').notEmpty(),
  body('phone', 'Phone number is required').notEmpty(),
  body('id_number', 'ID number is required').notEmpty(),
  body('date_birth', 'Date of birth is required').isISO8601().toDate(),
  body('bank_account', 'Bank Account is required').isNumeric(),
  body('npwp', 'NPWP is required').isNumeric(),
];
export const validateCustomerProfileCompletion: ValidationChain[] = [
  body('password', 'Password must be at least 6 characters').isLength({
    min: 6,
  }),
  body('name', 'Name is required').notEmpty(),
  body('photo').optional(),
  body('email', 'Email is required').notEmpty(),
  body('address', 'Address is required').notEmpty(),
  body('gender', 'Gender is required').notEmpty(),
  body('phone', 'Phone number is required').notEmpty(),
  body('id_number', 'ID number is required').notEmpty(),
  body('date_birth', 'Date of birth is required').isISO8601().toDate(),
];

export const logInValidate = [
  body('email').notEmpty().withMessage('email is empty'),
  body('password').notEmpty().withMessage('password is empty'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: 'error',
        message: errors.array(),
        data: null,
      });
      return;
    }
    next();
  },
];
