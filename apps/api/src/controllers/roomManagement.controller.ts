import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { User } from '@/types/auth.types';

const prisma = new PrismaClient();

export const getRoomTypesByProperty = async (req: Request, res: Response) => {
  try {
    const { property_code } = req.params;

    if (!property_code) {
      return res.status(400).json({
        status: 'error',
        message: 'Property code is required',
      });
    }

    // Find property by code
    const property = await prisma.property.findUnique({
      where: {
        property_code: property_code,
        deleted: false,
      },
    });

    if (!property) {
      return res.status(404).json({
        status: 'error',
        message: 'Property not found',
      });
    }

    // Find room types for the property
    const roomTypes = await prisma.roomType.findMany({
      where: {
        property_id: property.id,
        deleted: false,
      },
      include: {
        room_type_having_facilities: {
          where: {
            deleted: false,
          },
          include: {
            room_facility: true,
          },
        },
        room_number: {
          where: {
            deleted: false,
          },
        },
      },
    });

    if (roomTypes.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No room types found for this property',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Room types retrieved successfully',
      data: roomTypes,
    });
  } catch (error) {
    console.error('Error fetching room types:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve room types',
    });
  } finally {
    // Any cleanup operations can go here
  }
};

export const getPricesByRoomType = async (req: Request, res: Response) => {
  try {
    const { room_type_code } = req.params;
    const { check_in_date, check_out_date } = req.query;

    if (!room_type_code) {
      return res.status(400).json({
        status: 'error',
        message: 'Room type code is required',
      });
    }

    // Find room type by code
    const roomType = await prisma.roomType.findUnique({
      where: {
        room_type_code: room_type_code,
        deleted: false,
      },
      include: {
        room_number: {
          where: {
            deleted: false,
          },
        },
      },
    });

    if (!roomType) {
      return res.status(404).json({
        status: 'error',
        message: 'Room type not found',
      });
    }

    // Get room numbers for this room type
    const roomNumbers = roomType.room_number.map((room) => room.id);

    let priceQuery: any = {
      where: {
        room_numbers_id: {
          in: roomNumbers,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    };

    // Add date filtering if check-in and check-out dates are provided
    if (check_in_date && check_out_date) {
      // Parse dates
      const checkIn = new Date(check_in_date as string);
      const checkOut = new Date(check_out_date as string);

      // Validate dates
      if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid date format. Please use YYYY-MM-DD format.',
        });
      }

      priceQuery.where.OR = [
        {
          // Price periods that overlap with the requested dates
          AND: [
            { start_date: { lte: checkOut } },
            { end_date: { gte: checkIn } },
          ],
        },
        {
          // Price periods with no end date (current pricing)
          start_date: { lte: checkOut },
          end_date: null,
        },
      ];
    }

    const priceHistories =
      await prisma.propertyPriceHistory.findMany(priceQuery);

    // Base information to return
    const priceInfo = {
      roomTypeId: roomType.id,
      roomTypeName: roomType.room_type_name,
      roomTypeCode: roomType.room_type_code,
      basePrice: roomType.room_type_price,
      availableRooms: roomType.quantity_room,
      priceHistories: priceHistories.map((price) => ({
        id: price.id,
        startDate: price.start_date,
        endDate: price.end_date,
        roomNumberId: price.room_numbers_id,
        saleName: price.name_of_sale,
        discountType: price.discount_type,
        discountAmount: price.discount_amount,
        finalPrice: price.finall_price,
        propertyPriceHistoryCode: price.property_price_history_code,
      })),
    };

    return res.status(200).json({
      status: 'success',
      message: 'Price information retrieved successfully',
      data: priceInfo,
    });
  } catch (error) {
    console.error('Error fetching price information:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve price information',
    });
  } finally {
  }
};

export const getRoomDetailByRoomNumberCode = async (
  req: Request,
  res: Response,
) => {
  try {
    const { room_number_code } = req.params;

    if (!room_number_code) {
      return res.status(400).json({
        status: 'error',
        message: 'Room number code is required',
      });
    }

    // Find room by room_number_code
    const room = await prisma.roomNumber.findUnique({
      where: {
        room_number_code: room_number_code,
        deleted: false,
      },
      include: {
        room_type: {
          include: {
            property: {
              select: {
                id: true,
                property_name: true,
                property_code: true,
                address: true,
                city: true,
                province: true,
              },
            },
          },
        },
      },
    });

    if (!room) {
      return res.status(404).json({
        status: 'error',
        message: 'Room not found',
      });
    }

    // Format the response data
    const roomDetail = {
      room_number: room.room_number,
      room_number_code: room.room_number_code,
      room_type: {
        id: room.room_type.id,
        name: room.room_type.room_type_name,
        price: room.room_type.room_type_price,
        description: room.room_type.description,
        photo: room.room_type.room_photo,
      },
      property: {
        id: room.room_type.property.id,
        name: room.room_type.property.property_name,
        property_code: room.room_type.property.property_code,
        address: room.room_type.property.address,
        city: room.room_type.property.city,
        province: room.room_type.property.province,
      },
    };

    return res.status(200).json({
      status: 'success',
      message: 'Room detail retrieved successfully',
      data: roomDetail,
    });
  } catch (error) {
    console.error('Error fetching room detail:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve room detail',
    });
  } finally {
  }
};
