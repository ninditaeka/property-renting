import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { User, JwtPayload, UserRole } from '../types/auth.types';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
// Authentication middleware
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required',
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid authentication token',
        });
      }

      // Check if user is verified
      if (!user.is_verify) {
        return res.status(403).json({
          status: 'error',
          message: 'Account not verified',
        });
      }

      // Attach user to request
      req.user = {
        id: user.id,
        email: user.email,
        role: (user.role as UserRole) || '',
      };

      next();
    } catch (err) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired token',
      });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error occurred',
    });
  }
};

export const customerrGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req?.user as User;

    if (user?.role != 'customer') {
      res.status(401).json({
        status: 'unauthorized',
        message: 'token invalid',
        data: null,
      });
      return;
    }
    next();
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: JSON.stringify(err),
      data: null,
    });
  }
};

export const tenantGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log('masuk3');
  try {
    const user = req?.user as User;

    if (user?.role != 'tenant') {
      res.status(401).json({
        status: 'unauthorized',
        message: 'token invalid',
        data: null,
      });
      console.log('return guard1');
      return;
    }
    next();
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: JSON.stringify(err),
      data: null,
    });
  }
};
