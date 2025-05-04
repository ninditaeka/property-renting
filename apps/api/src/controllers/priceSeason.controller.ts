import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { User } from '@/types/auth.types';

const prisma = new PrismaClient();

export const createPriceSeason = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const action = req.query.action as string;

    // GET PROPERTIES WITH NAMES FOR DROPDOWN
    if (action === 'getProperties') {
      const properties = await prisma.property.findMany({
        where: {
          created_by: user.id,
          deleted: false,
        },
        select: {
          id: true,
          property_name: true,
          property_code: true,
          address: true,
          city: true,
        },
        orderBy: {
          property_name: 'asc',
        },
      });

      return res.status(200).json({
        status: 'success',
        data: properties,
      });
    }

    // GET ROOM TYPES FOR A SPECIFIC PROPERTY
    if (action === 'getRoomTypes') {
      const property_id = req.query.property_id as string;

      if (!property_id) {
        return res.status(400).json({
          status: 'error',
          message: 'Property ID is required',
        });
      }

      const roomTypes = await prisma.roomType.findMany({
        where: {
          property_id: parseInt(property_id),
          deleted: false,
        },
        select: {
          id: true,
          room_type_name: true,
          room_type_price: true,
          room_type_code: true,
          description: true,
        },
        orderBy: {
          room_type_name: 'asc',
        },
      });

      return res.status(200).json({
        status: 'success',
        data: roomTypes,
      });
    }

    // GET ROOM NUMBERS FOR A SPECIFIC ROOM TYPE
    if (action === 'getRoomNumbers') {
      const room_type_id = req.query.room_type_id as string;

      if (!room_type_id) {
        return res.status(400).json({
          status: 'error',
          message: 'Room Type ID is required',
        });
      }

      const roomNumbers = await prisma.roomNumber.findMany({
        where: {
          room_type_id: parseInt(room_type_id),
          deleted: false,
        },
        select: {
          id: true,
          room_number: true,
          room_number_code: true,
          room_type: {
            select: {
              room_type_price: true,
              room_type_name: true,
            },
          },
        },
        orderBy: {
          room_number: 'asc',
        },
      });

      // Extract the base price from the room type for easier use
      const enhancedRoomNumbers = roomNumbers.map((room) => ({
        ...room,
        base_price: room.room_type.room_type_price,
      }));

      return res.status(200).json({
        status: 'success',
        data: enhancedRoomNumbers,
      });
    }

    // CREATE PRICE SEASON
    // Extract data from request body
    const {
      property_id,
      room_numbers_id,
      name_of_sale,
      start_date,
      end_date,
      discount_type,
      discount_amount,
      finall_price,
    } = req.body;

    // Validate required fields
    if (
      !property_id ||
      !room_numbers_id ||
      !name_of_sale ||
      !start_date ||
      !end_date ||
      !discount_type
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields',
      });
    }

    // Always get base price from room type
    const roomNumber = await prisma.roomNumber.findUnique({
      where: {
        id: parseInt(room_numbers_id),
      },
      include: {
        room_type: true,
      },
    });

    if (!roomNumber) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid room number',
      });
    }

    const basePrice = roomNumber.room_type.room_type_price;

    // Calculate final price based on discount type
    let calculatedFinalPrice = basePrice;

    if (discount_type === 'nominal' && discount_amount) {
      calculatedFinalPrice = basePrice - parseInt(discount_amount);
    } else if (discount_type === 'percentage' && discount_amount) {
      calculatedFinalPrice =
        basePrice - basePrice * (parseInt(discount_amount) / 100);
    }

    // Create price season record
    const priceSeason = await prisma.propertyPriceHistory.create({
      data: {
        property_id: parseInt(property_id),
        room_numbers_id: parseInt(room_numbers_id),
        name_of_sale,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        discount_type,
        discount_amount: parseInt(discount_amount || '0'),
        finall_price: finall_price
          ? parseInt(finall_price)
          : Math.round(calculatedFinalPrice),
        updatedAt: new Date(),
      },
      include: {
        property: {
          select: {
            property_name: true,
            property_code: true,
          },
        },
        room_numbers: {
          include: {
            room_type: {
              select: {
                room_type_name: true,
                room_type_price: true,
              },
            },
          },
        },
      },
    });

    return res.status(201).json({
      status: 'success',
      message: 'Price season created successfully',
      data: priceSeason,
    });
  } catch (error: unknown) {
    console.error('Error:', error);

    // Properly handle the unknown error type
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';

    return res.status(500).json({
      status: 'error',
      message: 'Operation failed',
      error: errorMessage,
    });
  }
};

export const getAllPriceSeason = async (req: Request, res: Response) => {
  try {
    const propertyCategories = await prisma.propertyPriceHistory.findMany();

    return res.status(200).json({
      status: 'success',
      message: 'Successfully retrieved all price season',
      data: propertyCategories,
    });
  } catch (error) {
    console.error('Failed to retrieve price season:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    await prisma.$disconnect();
  }
};
