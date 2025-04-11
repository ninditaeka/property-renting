import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const createPropertyCategoryValidation = [
  body(
    'property_category_name',
    'Property Category Name is required',
  ).notEmpty(),
  body('description', 'Description is required').notEmpty(),
];

export const validateCreatePropertyCategory = (
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

export const updatePropertyCategoryValidation = [
  body(
    'property_category_name',
    'Property Category Name is required',
  ).notEmpty(),
  body('description', 'Description is required').notEmpty(),
];

export const validateUpdatePropertyCategory = (
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
