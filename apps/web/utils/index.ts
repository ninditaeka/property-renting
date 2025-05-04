import * as z from 'zod';

export const registerStartSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
});

export const registerCompleteTenant = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),

  date_birth: z.string().refine(
    (val) => {
      const birthDate = new Date(val);
      const today = new Date();
      const minAge = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate(),
      );
      return birthDate <= minAge;
    },
    { message: 'You must be at least 18 years old' },
  ),
  phone: z
    .string()
    .regex(/^[+]?[\d\s-]{10,14}$/, { message: 'Invalid phone number' }),
  id_number: z
    .string()
    .min(16, { message: 'KTP must be at least 16 characters' })
    .max(20, { message: 'KTP cannot exceed 20 characters' }),
  address: z
    .string()
    .min(5, { message: 'Address must be at least 5 characters' }),
  gender: z.enum(['male', 'female'], {
    required_error: 'Please select a gender',
  }),
  photo: z.string().optional(),
  npwp: z.string(),
  bank_account: z.string().min(1, {
    message: 'Bank account is required',
  }),
  bank_name: z.string().min(1, {
    message: 'Bank name is required',
  }),
});

export const registerCompleteCustomer = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),

  date_birth: z.string().refine(
    (val) => {
      const birthDate = new Date(val);
      const today = new Date();
      const minAge = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate(),
      );
      return birthDate <= minAge;
    },
    { message: 'You must be at least 18 years old' },
  ),
  phone: z
    .string()
    .regex(/^[+]?[\d\s-]{10,14}$/, { message: 'Invalid phone number' }),
  id_number: z
    .string()
    .min(16, { message: 'KTP must be at least 16 characters' })
    .max(20, { message: 'KTP cannot exceed 20 characters' }),
  address: z
    .string()
    .min(5, { message: 'Address must be at least 5 characters' }),
  gender: z.enum(['male', 'female'], {
    required_error: 'Please select a gender',
  }),
  photo: z.string().optional(),
});
