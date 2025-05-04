import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { parse, format } from 'date-fns';

const prisma = new PrismaClient();

export const PropertyListVeryDetail = async (req: Request, res: Response) => {
  try {
    // Parse query parameters
    const city = req.query.city as string;
    const checkIn = req.query['check-in'] as string;
    const checkOut = req.query['check-out'] as string;
    const rooms = parseInt(req.query.rooms as string) || 1;

    // Validate required parameters
    if (!city || !checkIn || !checkOut) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required parameters: city, check-in, check-out',
      });
    }

    // Parse dates from DD-MM-YYYY to Date objects
    let checkInDate, checkOutDate;
    try {
      checkInDate = parse(checkIn, 'dd-MM-yyyy', new Date());
      checkOutDate = parse(checkOut, 'dd-MM-yyyy', new Date());
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid date format. Please use DD-MM-YYYY format.',
      });
    }

    // 1. Get all properties in the specified city
    const properties = await prisma.property.findMany({
      where: {
        city: city,
        deleted: false,
      },
      select: {
        id: true,
        property_name: true,
        city: true,
        address: true,
        description: true,
        property_having_facilities: {
          where: {
            deleted: false,
          },
          select: {
            property_facility: {
              select: {
                property_facility_name: true,
              },
            },
          },
        },
        room_types: {
          where: {
            deleted: false,
          },
          select: {
            id: true,
            room_type_price: true,
            room_number: {
              where: {
                deleted: false,
              },
              select: {
                id: true,
                property_price_history: {
                  where: {
                    start_date: { lte: new Date() },
                    end_date: { gte: new Date() },
                  },
                  select: {
                    finall_price: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // 2. Get current bookings for the given dates
    const bookings = await prisma.propertyBooking.findMany({
      where: {
        check_in_date: new Date(format(checkInDate, 'yyyy-MM-dd 00:00:00')),
        check_out_date: new Date(format(checkOutDate, 'yyyy-MM-dd 00:00:00')),
      },
      select: {
        property_id: true,
        room_type_id: true,
      },
    });

    // 3. Process the data to match the output format from the raw query
    const processedProperties = properties.map((property) => {
      // Calculate the total rooms
      const totalRooms = property.room_types.length;

      // Calculate booked rooms
      const bookedRoomTypes = new Set(
        bookings
          .filter((booking) => booking.property_id === property.id)
          .map((booking) => booking.room_type_id),
      );
      const bookedRooms = bookedRoomTypes.size;

      // Determine availability status
      let availabilityStatus = 'available';
      if (totalRooms === 0) {
        availabilityStatus = 'unavailable';
      } else if (totalRooms - bookedRooms < rooms) {
        availabilityStatus = 'fullbooked';
      }

      // Calculate lowest price
      let lowestPrice = null;
      if (availabilityStatus !== 'unavailable') {
        const allPrices = property.room_types.flatMap((rt) => {
          const roomTypePrices = [rt.room_type_price];
          const specialPrices = rt.room_number.flatMap((rn) =>
            rn.property_price_history.map((pph) => pph.finall_price),
          );
          return [...roomTypePrices, ...specialPrices].filter(Boolean);
        });

        if (allPrices.length > 0) {
          lowestPrice = Math.min(...allPrices);
        }
      }

      // Format facilities
      const facilities = property.property_having_facilities
        .map((phf) => phf.property_facility.property_facility_name)
        .sort()
        .join(', ');

      return {
        id: property.id,
        property_name: property.property_name,
        city: property.city,
        address: property.address,
        property_description: property.description,
        facilities: facilities,
        total_rooms: totalRooms,
        booked_rooms: bookedRooms,
        availability_status: availabilityStatus,
        lowest_price: lowestPrice,
      };
    });

    // Format the response
    return res.status(200).json({
      status: 'success',
      message: 'Successfully retrieved property list',
      data: {
        properties: processedProperties,
        filters: {
          city,
          checkIn,
          checkOut,
          rooms,
        },
      },
    });
  } catch (error) {
    console.error('Failed to retrieve property list:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    await prisma.$disconnect();
  }
};
