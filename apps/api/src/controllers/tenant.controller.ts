import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { User } from '@/types/auth.types';

const prisma = new PrismaClient();

interface WhereCondition {
  property_id?: number | { in: number[] };
  room_numbers_id?: number | { in: number[] };
  OR?: Array<{
    AND?: Array<{
      start_date?: { lte: Date };
      end_date?: { gte: Date };
    }>;
    start_date?: { lte: Date } | { gte: Date };
    end_date?: { gte: Date } | null;
  }>;
}
const whereCondition: WhereCondition = {};

export const getPropertyByUserToken = async (req: Request, res: Response) => {
  try {
    // Get user from request object (set by authenticate middleware)
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required',
      });
    }

    // Find all properties created by this user
    const properties = await prisma.property.findMany({
      where: {
        created_by: user.id,
        deleted: false,
      },
      include: {
        property_category: {
          select: {
            id: true,
            property_category_name: true,
            description: true,
          },
        },
        room_types: {
          where: {
            deleted: false,
          },
          select: {
            id: true,
            room_type_name: true,
            description: true,
            room_type_price: true,
            quantity_room: true,
            room_photo: true,
            room_type_code: true,
            room_number: {
              where: {
                deleted: false,
              },
              select: {
                id: true,
                room_number: true,
                room_number_code: true,
              },
            },
            room_type_having_facilities: {
              where: {
                deleted: false,
              },
              select: {
                room_facility: {
                  select: {
                    id: true,
                    room_facility_name: true,
                  },
                },
              },
            },
          },
        },
        property_having_facilities: {
          where: {
            deleted: false,
          },
          select: {
            property_facility: {
              select: {
                id: true,
                property_facility_name: true,
              },
            },
          },
        },
      },
    });

    if (properties.length === 0) {
      return res.status(200).json({
        status: 'success',
        message: 'No properties found for this user',
        data: [],
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Properties retrieved successfully',
      data: properties,
    });
  } catch (error) {
    console.error('Error fetching properties by user token:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const getAllRoomInfoByUserToken = async (
  req: Request,
  res: Response,
) => {
  try {
    // Get user from request object (set by authenticate middleware)
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required',
      });
    }

    // Get room information for properties created by this user
    const roomInfo = await prisma.roomNumber.findMany({
      where: {
        deleted: false,
        room_type: {
          property: {
            created_by: user.id,
          },
        },
      },
      include: {
        room_type: {
          include: {
            property: {
              select: {
                id: true,
                property_name: true,
                property_code: true,
                property_photo: true,
                address: true,
                city: true,
                province: true,
              },
            },
          },
        },
      },
    });

    if (roomInfo.length === 0) {
      return res.status(200).json({
        status: 'success',
        message: 'No rooms found for this user',
        data: [],
      });
    }

    // Format the response data
    const formattedRoomInfo = roomInfo.map((room) => ({
      room_number_id: room.id,
      room_number: room.room_number,
      room_number_code: room.room_number_code,
      room_type: {
        id: room.room_type.id,
        room_type_name: room.room_type.room_type_name,
        room_type_price: room.room_type.room_type_price,
        room_photo: room.room_type.room_photo,
        description: room.room_type.description,
      },
      property: {
        id: room.room_type.property.id,
        property_name: room.room_type.property.property_name,
        property_code: room.room_type.property.property_code,
        property_photo: room.room_type.property.property_photo,
        address: room.room_type.property.address,
        city: room.room_type.property.city,
        province: room.room_type.property.province,
      },
    }));

    return res.status(200).json({
      status: 'success',
      message: 'Room information retrieved successfully',
      data: formattedRoomInfo,
    });
  } catch (error) {
    console.error('Error fetching room information by user token:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const getPriceManagementDashboardByUserToken = async (
  req: Request,
  res: Response,
) => {
  try {
    // Get user from request object (set by authenticate middleware)
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required',
      });
    }

    // Get additional query parameters for filtering
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

    // First, get all properties owned by this user
    const userProperties = await prisma.property.findMany({
      where: {
        created_by: user.id,
        deleted: false,
      },
      select: {
        id: true,
      },
    });

    if (userProperties.length === 0) {
      return res.status(200).json({
        status: 'success',
        message: 'No properties found for this user',
        data: [],
      });
    }

    // Filter by user's properties
    whereCondition.property_id = {
      in: userProperties.map((property) => property.id),
    };

    // Add filters for specific property if requested
    if (property_id) {
      // Check if this property belongs to the user
      const propertyBelongsToUser = userProperties.some(
        (property) => property.id === Number(property_id),
      );

      if (!propertyBelongsToUser) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied: Property does not belong to this user',
        });
      }

      whereCondition.property_id = Number(property_id);
    } else if (property_code) {
      // Find property by code first, then verify it belongs to this user
      const property = await prisma.property.findFirst({
        where: {
          property_code: String(property_code),
          created_by: user.id,
          deleted: false,
        },
      });

      if (!property) {
        return res.status(404).json({
          status: 'error',
          message: 'Property not found or does not belong to this user',
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
      // Find room numbers for the given room type that belong to this user's properties
      const roomTypeFilter: { id?: number; room_type_code?: string } = {};

      if (room_type_id) {
        roomTypeFilter.id = Number(room_type_id);
      } else if (room_type_code) {
        roomTypeFilter.room_type_code = String(room_type_code);
      }

      const roomNumbers = await prisma.roomNumber.findMany({
        where: {
          room_type: {
            ...roomTypeFilter,
            property: {
              created_by: user.id,
            },
          },
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
            user: {
              select: {
                id: true,
                name: true,
                user_code: true,
              },
            },
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

    // If no results, return empty array with success status
    if (priceManagementData.length === 0) {
      return res.status(200).json({
        status: 'success',
        message: 'No price management data found for the specified criteria',
        data: [],
      });
    }

    // Format the response data
    const formattedData = priceManagementData.map((price) => ({
      price_id: price.id,
      price_history_code: price.property_price_history_code,
      user_code: price.property.user.user_code,
      user_name: price.property.user.name,
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
    console.error('Error fetching price management data by user token:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve price management data',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    await prisma.$disconnect();
  }
};
