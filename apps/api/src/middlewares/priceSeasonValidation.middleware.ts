import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const createPriceSeasonValidation = [
  // Required fields
  body('property_id')
    .notEmpty()
    .withMessage('Property ID is required')
    .isInt()
    .withMessage('Property ID must be an integer'),

  body('room_numbers_id')
    .notEmpty()
    .withMessage('Room Number ID is required')
    .isInt()
    .withMessage('Room Number ID must be an integer'),

  body('name_of_sale')
    .notEmpty()
    .withMessage('Name of sale is required')
    .isLength({ max: 100 })
    .withMessage('Name of sale must be less than 100 characters'),

  body('start_date')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid date format'),

  body('end_date')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('End date must be a valid date format')
    .custom((value, { req }) => {
      const startDate = new Date(req.body.start_date);
      const endDate = new Date(value);
      if (endDate <= startDate) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),

  body('discount_type')
    .notEmpty()
    .withMessage('Discount type is required')
    .isIn(['nominal', 'percentage'])
    .withMessage('Discount type must be either "nominal" or "percentage"'),

  body('discount_amount')
    .notEmpty()
    .withMessage('Discount amount is required')
    .isInt({ min: 0 })
    .withMessage('Discount amount must be a non-negative integer')
    .custom((value, { req }) => {
      if (req.body.discount_type === 'percentage' && parseInt(value) > 100) {
        throw new Error('Percentage discount cannot exceed 100%');
      }
      return true;
    }),

  // Optional fields
  body('base_price')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Base price must be a non-negative integer'),

  body('finall_price')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Final price must be a non-negative integer'),
];

export const validateCreatePriceSeason = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation error',
      errors: errors.array(),
    });
  }

  next();
};
