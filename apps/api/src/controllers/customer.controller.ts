import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { User } from '@/types/auth.types';
const prisma = new PrismaClient();

export const getDataCustomerbyUserCode = async (
  req: Request,
  res: Response,
) => {
  try {
    const { user_code } = req.params;

    if (!user_code) {
      return res.status(400).json({
        status: 'error',
        message: 'User Code is required',
      });
    }

    const userData = await prisma.user.findFirst({
      where: {
        user_code: user_code,
        role: 'customer',
      },
      select: {
        id: true,
        name: true,
        date_birth: true,
        address: true,
        gender: true,
        phone: true,
        is_verify: true,
        id_number: true,
        email: true,
        role: true,
        photo: true,
        createdAt: true,
        user_code: true,
        // Excluding password and other sensitive fields
      },
    });

    if (!userData) {
      return res.status(404).json({
        status: 'error',
        message: 'Customer not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: userData,
    });
  } catch (error) {
    console.error('Error getting customer data:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};
