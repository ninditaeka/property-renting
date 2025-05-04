import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

// Get property and room types by property code
export const getPropertyWithRoomTypesByCode = async (
  req: Request,
  res: Response,
) => {
  try {
    console.log('Tes1');
    const { propertyCode } = req.params;

    const propertyWithRoomTypes = await prisma.property.findUnique({
      where: {
        property_code: propertyCode,
        deleted: false,
      },
      include: {
        room_types: {
          where: {
            deleted: false,
          },
          include: {
            room_number: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        property_category: true,
      },
    });

    if (!propertyWithRoomTypes) {
      console.log('Tes4');

      console.log('Tes2');
      return res.status(404).json({
        status: 'error',
        message: 'Property not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Successfully retrieved property with room types',
      data: propertyWithRoomTypes,
    });
  } catch (error) {
    console.error('Error fetching property with room types:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    await prisma.$disconnect();
  }
};

// Get property with facilities by property code
export const getPropertyWithFacilitiesByCode = async (
  req: Request,
  res: Response,
) => {
  try {
    const { propertyCode } = req.params;

    const propertyWithFacilities = await prisma.property.findUnique({
      where: {
        property_code: propertyCode,
        deleted: false,
      },
      include: {
        property_having_facilities: {
          where: {
            deleted: false,
          },
          include: {
            property_facility: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        property_category: true,
      },
    });

    if (!propertyWithFacilities) {
      return res.status(404).json({
        status: 'error',
        message: 'Property not found',
      });
    }

    // Transform the data to make it more readable
    const facilities = propertyWithFacilities.property_having_facilities.map(
      (item) => ({
        id: item.property_facility.id,
        name: item.property_facility.property_facility_name,
        facilityRelationId: item.id,
      }),
    );

    const responseData = {
      ...propertyWithFacilities,
      facilities,
    };

    return res.status(200).json({
      status: 'success',
      message: 'Successfully retrieved property with facilities',
      data: responseData,
    });
  } catch (error) {
    console.error('Error fetching property with facilities:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const getPropertyDetailByCodeWithRoomDetailAvailabilityFacilitiesAndLowerPrice =
  async (req: Request, res: Response) => {
    try {
      console.log(
        'Fetching property with room details, availability, facilities and lowest price',
      );
      const { propertyCode } = req.params;
      // const { checkInDate, checkOutDate } = req.query;
      const checkInDate = req.query['check-in'];
      const checkOutDate = req.query['check-out'];

      if (!checkInDate || !checkOutDate) {
        return res.status(400).json({
          status: 'error',
          message: 'Check-in and check-out dates are required',
        });
      }

      // First, find the property by code to ensure it exists
      const property = await prisma.property.findUnique({
        where: {
          property_code: propertyCode,
          deleted: false,
        },
        select: {
          id: true,
          property_name: true,
          property_photo: true,
        },
      });

      if (!property) {
        return res.status(404).json({
          status: 'error',
          message: 'Property not found or has been deleted',
        });
      }

      const parseCustomDateFormat = (dateString: string) => {
        const [day, month, year] = dateString.split('-');
        return new Date(`${year}-${month}-${day}`);
      };

      // Parse the date strings into Date objects
      const parsedCheckInDate = parseCustomDateFormat(checkInDate as string);
      const parsedCheckOutDate = parseCustomDateFormat(checkOutDate as string);
      // Get current bookings for the given date range
      const currentBookings = await prisma.propertyBooking.groupBy({
        by: ['property_id'],
        where: {
          check_in_date: parsedCheckInDate,
          check_out_date: parsedCheckOutDate,
        },
        _count: {
          room_type_id: true,
        },
      });

      // Map bookings to a more usable format
      const bookingsMap = currentBookings.reduce(
        (acc, booking) => {
          acc[booking.property_id] = booking._count.room_type_id;
          return acc;
        },
        {} as Record<string, number>,
      );

      // Get active room count
      const activeRoomCount = await prisma.roomType.groupBy({
        by: ['property_id'],
        where: {
          deleted: false,
          property_id: property.id,
        },
        _count: {
          id: true,
        },
      });

      const roomCountMap = activeRoomCount.reduce(
        (acc, room) => {
          acc[room.property_id] = room._count.id;
          return acc;
        },
        {} as Record<string, number>,
      );

      // Get total room count and availability status
      const totalRooms = await prisma.roomType.count({
        where: {
          property_id: property.id,
          deleted: false,
        },
      });

      const bookedRooms = bookingsMap[property.id] || 0;

      let availabilityStatus = 'unavailable';
      if (roomCountMap[property.id]) {
        if (totalRooms > bookedRooms) {
          availabilityStatus = 'available';
        } else {
          availabilityStatus = 'fullbooked';
        }
      }

      // Get property facilities
      const propertyFacilities = await prisma.propertyHavingFacility.findMany({
        where: {
          property_id: property.id,
          deleted: false,
        },
        include: {
          property_facility: true,
        },
      });

      const facilityNames = propertyFacilities
        .map((pf) => pf.property_facility.property_facility_name)
        .sort()
        .join(', ');

      // Get lowest price information
      // We'll need to get the lowest price across both regular room prices and any active price histories
      const roomTypes = await prisma.roomType.findMany({
        where: {
          property_id: property.id,
          deleted: false,
        },
        include: {
          room_number: {
            where: {
              deleted: false,
            },
            include: {
              property_price_history: {
                where: {
                  start_date: {
                    lte: new Date(),
                  },
                  end_date: {
                    gte: new Date(),
                  },
                },
              },
            },
          },
          room_type_having_facilities: {
            where: {
              deleted: false,
            },
            include: {
              room_facility: true,
            },
          },
        },
      });

      let lowestPrice = null;
      const roomDetails = [];

      // Process room types to get room details and calculate lowest price
      for (const room of roomTypes) {
        // Get room facilities
        // const roomFacilities = room.room_type_having_facilities
        //   .map((rf) => rf.room_facility.room_facility_name)
        //   .join(', ');

        const roomFacilities = [
          ...new Set(
            room.room_type_having_facilities.map(
              (rf) => rf.room_facility.room_facility_name,
            ),
          ),
        ].join(', ');
        // Find the lowest price for this room (either regular price or from active price histories)
        let roomLowestPrice = room.room_type_price;
        for (const roomNumber of room.room_number) {
          for (const priceHistory of roomNumber.property_price_history) {
            if (priceHistory.finall_price < roomLowestPrice) {
              roomLowestPrice = priceHistory.finall_price;
            }
          }
        }

        // Update overall lowest price if needed
        if (lowestPrice === null || roomLowestPrice < lowestPrice) {
          lowestPrice = roomLowestPrice;
        }

        // Add room details to our result - now including room_type_code
        roomDetails.push({
          room_type_id: room.id,
          room_type_code: room.room_type_code, // Added room_type_code here
          room_type_name: room.room_type_name,
          description: room.description,
          room_type_price: room.room_type_price,
          quantity_room: room.quantity_room,
          room_photo: room.room_photo,
          property_id: room.property_id,
          room_facilities: roomFacilities,
        });
      }

      // If property is unavailable, set lowest price to null
      if (availabilityStatus === 'unavailable') {
        lowestPrice = null;
      }

      // Build the final response
      const result = {
        property_details: {
          id: property.id,
          property_name: property.property_name,
          property_photo: property.property_photo,
          property_facilities: facilityNames,
          total_rooms: totalRooms,
          booked_rooms: bookedRooms,
          availability_status: availabilityStatus,
          lowest_price: lowestPrice,
        },
        room_details: roomDetails,
      };

      return res.status(200).json({
        status: 'success',
        message:
          'Successfully retrieved property details with availability and pricing',
        data: result,
      });
    } catch (error) {
      console.error(
        'Error in getPropertyByCodeWithRoomDetailAvailabilityFacilitiesAndLowerPrice:',
        error,
      );
      return res.status(500).json({
        status: 'error',
        message: 'Server error occurred',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      await prisma.$disconnect();
    }
  };
