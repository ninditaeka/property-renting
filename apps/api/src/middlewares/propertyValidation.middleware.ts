import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const createPropertyValidation = [
  // Basic property information
  body('property_name', 'Property name is required').notEmpty(),
  body('province', 'Province is required').notEmpty(),
  body('city', 'City is required').notEmpty(),
  body('address', 'Address is required').notEmpty(),
  body('description', 'Description is required').notEmpty(),
  body('property_photo', 'Property photo is required').notEmpty(),
  body('property_category_id', 'Property category ID is required').isInt({
    min: 1,
  }),

  // Facility IDs validation
  body('property_facility_ids', 'Facility IDs must be an array').isArray(),
  body(
    'property_facility_ids.*',
    'Property Facility ID must be a positive integer',
  ).isInt({
    min: 1,
  }),

  // Room types validation
  body('room_types', 'Room types must be an array').isArray(),
  body(
    'room_types.*.room_type_name',
    'Room type name is required for each room',
  ).notEmpty(),
  body(
    'room_types.*.description',
    'Description is required for each room',
  ).notEmpty(),
  body(
    'room_types.*.room_type_price',
    'Room type price must be a positive number',
  ).isInt({ min: 1 }),
  body(
    'room_types.*.quantity_room',
    'Quantity of rooms must be a positive number',
  ).isInt({ min: 1 }),
  body('room_types.*.room_photo').optional(),
];

export const validateCreateProperty = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('masuk2');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const updatePropertyValidation = [
  // Similar to create but making fields optional
  body('property_name')
    .optional()
    .notEmpty()
    .withMessage('Property name cannot be empty if provided'),
  body('province')
    .optional()
    .notEmpty()
    .withMessage('Province cannot be empty if provided'),
  body('city')
    .optional()
    .notEmpty()
    .withMessage('City cannot be empty if provided'),
  body('address')
    .optional()
    .notEmpty()
    .withMessage('Address cannot be empty if provided'),
  body('description')
    .optional()
    .notEmpty()
    .withMessage('Description cannot be empty if provided'),
  body('property_photo')
    .optional()
    .notEmpty()
    .withMessage('Property photo cannot be empty if provided'),
  body('property_category_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Property category ID must be a positive integer if provided'),

  // Facility IDs validation (optional for update)
  body('property_facility_ids')
    .optional()
    .isArray()
    .withMessage('Property Facility IDs must be an array if provided'),
  body('property_facility_ids.*')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Property Facility ID must be a positive integer'),

  // Room types validation (optional for update)
  body('room_types')
    .optional()
    .isArray()
    .withMessage('Room types must be an array if provided'),
  body('room_types.*.room_type_name')
    .optional()
    .notEmpty()
    .withMessage('Room type name cannot be empty if provided'),
  body('room_types.*.description')
    .optional()
    .notEmpty()
    .withMessage('Description cannot be empty if provided'),
  body('room_types.*.room_type_price')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Room type price must be a positive number if provided'),
  body('room_types.*.quantity_room')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity of rooms must be a positive number if provided'),
  body('room_types.*.room_photo')
    .optional()
    .notEmpty()
    .withMessage('Room photo cannot be empty if provided'),
];

export const validateUpdateProperty = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
