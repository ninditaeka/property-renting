import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const getAllPropertyFacilities = async (req: Request, res: Response) => {
  try {
    const propertyFacilities = await prisma.propertyFacility.findMany({});

    return res.status(200).json({
      status: 'success',
      message: 'Successfully retrieved all property categories',
      data: propertyFacilities,
    });
  } catch (error) {
    console.error('Failed to retrieve Property Category:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    await prisma.$disconnect();
  }
};
