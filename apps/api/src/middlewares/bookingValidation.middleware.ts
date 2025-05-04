import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const createBookingValidation = [
  body('full_name', 'Full Name base ID is required').notEmpty(),
  body('phone_number', 'Phone Number is required').notEmpty(),
];

export const validateCreateBooking = (
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
