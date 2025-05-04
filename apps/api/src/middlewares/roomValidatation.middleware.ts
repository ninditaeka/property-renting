import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const createRoomValidation = [
  // Room basic information
  body('property_id', 'Property ID is required').isInt({
    min: 1,
  }),
  body('room_type_id', 'Room type ID is required').isInt({
    min: 1,
  }),
  body('room_number', 'Room number is required').notEmpty(),

  // Room facilities validation
  body('room_facilities_ids', 'Room facilities IDs must be an array').isArray(),
  body(
    'room_facilities_ids.*',
    'Room facility ID must be a positive integer',
  ).isInt({
    min: 1,
  }),
];

export const validateCreateRoom = (
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

export const updateRoomValidation = [
  // Room basic information
  body('property_id', 'Property ID is required').isInt({
    min: 1,
  }),
  body('room_type_id', 'Room type ID is required').isInt({
    min: 1,
  }),
  body('room_number', 'Room number is required').notEmpty(),

  // Room facilities validation
  body('room_facilities_ids', 'Room facilities IDs must be an array').isArray(),
  body(
    'room_facilities_ids.*',
    'Room facility ID must be a positive integer',
  ).isInt({
    min: 1,
  }),
];

export const validateUpdateRoom = (
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
