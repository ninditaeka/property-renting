import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export interface WhereCondition {
  property_id?: number;
  room_numbers_id?: number | { in: number[] };
  OR?: Array<{
    AND?: Array<{ start_date?: any; end_date?: any }>;
    start_date?: any;
    end_date?: any;
  }>;
}

export const getPriceManagement = async (req: Request, res: Response) => {
  try {
    // Get query parameters for filtering
    const {
      property_id,
      property_code,
      room_type_id,
      room_type_code,
      room_number_id,
      start_date,
      end_date,
    } = req.query;

    // Build the where condition for filtering
    const whereCondition: WhereCondition = {};

    // Add filters for property
    if (property_id) {
      whereCondition.property_id = Number(property_id);
    } else if (property_code) {
      // Find property by code first, then use its ID
      const property = await prisma.property.findUnique({
        where: {
          property_code: String(property_code),
          deleted: false,
        },
      });

      if (!property) {
        return res.status(404).json({
          status: 'error',
          message: 'Property not found',
        });
      }

      whereCondition.property_id = property.id;
    }

    // Add filters for room
    if (room_number_id) {
      whereCondition.room_numbers_id = Number(room_number_id);
    }

    // Add filters for room type (more complex as it's a relation through room_numbers)
    if (room_type_id || room_type_code) {
      // Find room numbers for the given room type
      const roomTypeFilter: { id?: number; room_type_code?: string } = {};

      if (room_type_id) {
        roomTypeFilter.id = Number(room_type_id);
      } else if (room_type_code) {
        roomTypeFilter.room_type_code = String(room_type_code);
      }

      const roomNumbers = await prisma.roomNumber.findMany({
        where: {
          room_type: roomTypeFilter,
          deleted: false,
        },
        select: {
          id: true,
        },
      });

      if (roomNumbers.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'No rooms found for the specified room type',
        });
      }

      whereCondition.room_numbers_id = {
        in: roomNumbers.map((room) => room.id),
      };
    }

    // Add date range filtering if provided
    if (start_date || end_date) {
      whereCondition.OR = [];

      if (start_date && end_date) {
        // Prices that overlap with the requested date range
        whereCondition.OR.push({
          AND: [
            { start_date: { lte: new Date(String(end_date)) } },
            { end_date: { gte: new Date(String(start_date)) } },
          ],
        });

        // Prices with no end date (current pricing) that start before the end date
        whereCondition.OR.push({
          start_date: { lte: new Date(String(end_date)) },
          end_date: null,
        });
      } else if (start_date) {
        // Prices that are active after the start date
        whereCondition.OR.push({
          start_date: { gte: new Date(String(start_date)) },
        });
        whereCondition.OR.push({
          end_date: { gte: new Date(String(start_date)) },
        });
      } else if (end_date) {
        // Prices that are active before the end date
        whereCondition.OR.push({
          start_date: { lte: new Date(String(end_date)) },
        });
      }
    }

    // Get pricing data with all related information
    const priceManagementData = await prisma.propertyPriceHistory.findMany({
      where: whereCondition,
      include: {
        property: {
          select: {
            id: true,
            property_name: true,
            property_code: true,
          },
        },
        room_numbers: {
          select: {
            id: true,
            room_number: true,
            room_number_code: true,
            room_type: {
              select: {
                id: true,
                room_type_name: true,
                room_type_code: true,
                room_type_price: true,
              },
            },
          },
        },
      },
      orderBy: [{ property_id: 'asc' }, { start_date: 'desc' }],
    });

    // If no results, return appropriate message
    if (priceManagementData.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No price management data found for the specified criteria',
      });
    }

    // Format the response data
    const formattedData = priceManagementData.map((price) => ({
      price_id: price.id,
      price_history_code: price.property_price_history_code,
      property_name: price.property.property_name,
      property_code: price.property.property_code,
      room_number: price.room_numbers.room_number,
      room_number_code: price.room_numbers.room_number_code,
      room_type_name: price.room_numbers.room_type.room_type_name,
      room_type_code: price.room_numbers.room_type.room_type_code,
      base_price: price.room_numbers.room_type.room_type_price,
      name_of_sale: price.name_of_sale,
      discount_type: price.discount_type,
      discount_amount: price.discount_amount,
      final_price: price.finall_price,
      start_date: price.start_date,
      end_date: price.end_date,
      created_at: price.createdAt,
    }));

    // Return success response
    return res.status(200).json({
      status: 'success',
      message: 'Price management data retrieved successfully',
      data: formattedData,
    });
  } catch (error) {
    console.error('Error fetching price management data:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve price management data',
    });
  }
};

export const getRoomNumbersByRoomType = async (req: Request, res: Response) => {
  try {
    const { room_type_code } = req.params;

    // Validate room_type_code
    if (!room_type_code) {
      return res.status(400).json({
        status: 'error',
        message: 'Valid room type code is required',
      });
    }

    // Find the room type by code first
    const roomType = await prisma.roomType.findUnique({
      where: {
        room_type_code: room_type_code,
        deleted: false,
      },
    });

    if (!roomType) {
      return res.status(404).json({
        status: 'error',
        message: 'Room type not found',
      });
    }

    // Get room numbers for the found room type
    const roomNumbers = await prisma.roomNumber.findMany({
      where: {
        room_type_id: roomType.id,
        deleted: false,
      },
      select: {
        id: true,
        room_number: true,
        room_number_code: true,
      },
      orderBy: {
        room_number: 'asc',
      },
    });

    // Format the response for dropdown
    const formattedRoomNumbers = roomNumbers.map((room) => ({
      room_number: room.room_number,
      room_number_code: room.room_number_code,
      id: room.id,
    }));

    return res.status(200).json({
      status: 'success',
      message: 'Room numbers retrieved successfully',
      data: formattedRoomNumbers,
    });
  } catch (error) {
    console.error('Error fetching room numbers:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve room numbers',
    });
  }
};
