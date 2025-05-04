// import { Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// // Get a specific room type with its facilities by room_type_code and check availability
// export const getRoomTypewithFacilitiesandAvabilityByRoomTypeCode = async (
//   req: Request,
//   res: Response,
// ) => {
//   try {
//     console.log('Fetching room type by code');
//     const { roomTypeCode } = req.params;
//     const currentDate = new Date(); // Current time when API is hit

//     console.log('Room Type Code:', roomTypeCode);
//     console.log('Current Date:', currentDate);

//     if (!roomTypeCode) {
//       return res.status(400).json({
//         status: 'error',
//         message: 'Room type code is required',
//       });
//     }

//     // Fetch the room type with facilities using the room_type_code
//     const roomType = await prisma.roomType.findUnique({
//       where: {
//         room_type_code: roomTypeCode,
//         deleted: false,
//       },
//       include: {
//         room_type_having_facilities: {
//           include: {
//             room_facility: true,
//           },
//           where: {
//             deleted: false,
//           },
//         },
//         property: {
//           select: {
//             property_name: true,
//             address: true,
//             city: true,
//             province: true,
//             property_code: true,
//           },
//         },
//         room_number: {
//           where: {
//             deleted: false,
//           },
//         },
//       },
//     });

//     if (!roomType) {
//       console.log('Room type not found');
//       return res.status(404).json({
//         status: 'error',
//         message: 'Room type not found',
//       });
//     }

//     // Case 1: Get active bookings that overlap with current date
//     // These are rooms currently occupied (current date is between check-in and check-out)
//     const activeBookings = await prisma.propertyBooking.count({
//       where: {
//         room_type_id: roomType.id,
//         AND: [
//           { check_in_date: { lte: currentDate } },
//           { check_out_date: { gte: currentDate } },
//         ],
//       },
//     });

//     // Case 2: Get all bookings for this room type to check against total quantity
//     const totalBookingsByRoomType = await prisma.propertyBooking.count({
//       where: {
//         room_type_id: roomType.id,
//       },
//     });

//     // Get a list of all future bookings for this room type
//     const futureBookings = await prisma.propertyBooking.findMany({
//       where: {
//         room_type_id: roomType.id,
//         check_in_date: { gt: currentDate },
//       },
//       select: {
//         check_in_date: true,
//         check_out_date: true,
//       },
//       orderBy: {
//         check_in_date: 'asc',
//       },
//     });

//     // Calculate available rooms right now (current availability)
//     const currentlyAvailableRooms = roomType.quantity_room - activeBookings;

//     // Generate a response with availability information
//     const enhancedRoomType = {
//       ...roomType,
//       availability: {
//         total_quantity: roomType.quantity_room,
//         total_bookings: totalBookingsByRoomType,
//         // Current availability status
//         current_status: {
//           date: currentDate,
//           occupied_rooms: activeBookings,
//           available_rooms: currentlyAvailableRooms,
//           is_available: currentlyAvailableRooms > 0,
//         },
//         // Future booking information
//         future_bookings: futureBookings.map((booking) => ({
//           check_in_date: booking.check_in_date,
//           check_out_date: booking.check_out_date,
//         })),
//       },
//     };

//     // Transform the room_type_having_facilities into a more readable format
//     const facilities = roomType.room_type_having_facilities.map((facility) => ({
//       id: facility.room_facility.id,
//       name: facility.room_facility.room_facility_name,
//     }));

//     // Create a clean response object
//     const responseData = {
//       id: roomType.id,
//       room_type_name: roomType.room_type_name,
//       description: roomType.description,
//       room_type_price: roomType.room_type_price,
//       quantity_room: roomType.quantity_room,
//       room_photo: roomType.room_photo,
//       room_type_code: roomType.room_type_code,
//       property: roomType.property,
//       facilities: facilities,
//       availability: enhancedRoomType.availability,
//     };

//     return res.status(200).json({
//       status: 'success',
//       message:
//         'Successfully retrieved room type with facilities and availability',
//       data: responseData,
//     });
//   } catch (error) {
//     console.error('Error fetching room type:', error);
//     return res.status(500).json({
//       status: 'error',
//       message: 'Server error occurred',
//       error: error instanceof Error ? error.message : 'Unknown error',
//     });
//   } finally {
//     await prisma.$disconnect();
//   }
// };
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get a specific room type with its facilities by room_type_code and check availability
export const getRoomTypewithFacilitiesLowestPriceandAvabilityByRoomTypeCode =
  async (req: Request, res: Response) => {
    try {
      console.log('Fetching room type by code');
      const { roomTypeCode } = req.params;
      const currentDate = new Date(); // Current time when API is hit

      console.log('Room Type Code:', roomTypeCode);
      console.log('Current Date:', currentDate);

      if (!roomTypeCode) {
        return res.status(400).json({
          status: 'error',
          message: 'Room type code is required',
        });
      }

      // Fetch the room type with facilities using the room_type_code
      const roomType = await prisma.roomType.findUnique({
        where: {
          room_type_code: roomTypeCode,
          deleted: false,
        },
        include: {
          room_type_having_facilities: {
            include: {
              room_facility: true,
            },
            where: {
              deleted: false,
            },
          },
          property: {
            select: {
              property_name: true,
              address: true,
              city: true,
              province: true,
              property_code: true,
            },
          },
          room_number: {
            where: {
              deleted: false,
            },
          },
        },
      });

      if (!roomType) {
        console.log('Room type not found');
        return res.status(404).json({
          status: 'error',
          message: 'Room type not found',
        });
      }

      // Case 1: Get active bookings that overlap with current date
      // These are rooms currently occupied (current date is between check-in and check-out)
      const activeBookings = await prisma.propertyBooking.count({
        where: {
          room_type_id: roomType.id,
          AND: [
            { check_in_date: { lte: currentDate } },
            { check_out_date: { gte: currentDate } },
          ],
        },
      });

      // Case 2: Get all bookings for this room type to check against total quantity
      const totalBookingsByRoomType = await prisma.propertyBooking.count({
        where: {
          room_type_id: roomType.id,
        },
      });

      // Get a list of all future bookings for this room type
      const futureBookings = await prisma.propertyBooking.findMany({
        where: {
          room_type_id: roomType.id,
          check_in_date: { gt: currentDate },
        },
        select: {
          check_in_date: true,
          check_out_date: true,
        },
        orderBy: {
          check_in_date: 'asc',
        },
      });

      // Calculate available rooms right now (current availability)
      const currentlyAvailableRooms = roomType.quantity_room - activeBookings;
      const isAvailable = currentlyAvailableRooms > 0;

      // Only process pricing if rooms are available
      let bestPrice = roomType.room_type_price; // Default to standard price
      let priceDetails = null;

      if (isAvailable) {
        // Get room numbers for this room type that are available (not booked)
        const availableRoomNumbers = roomType.room_number.map(
          (room) => room.id,
        );

        // Check if any room numbers have active price promotions
        const activePromotions = await prisma.propertyPriceHistory.findMany({
          where: {
            room_numbers_id: {
              in: availableRoomNumbers,
            },
            AND: [
              { start_date: { lte: currentDate } }, // start_date <= current date (promotion has started)
              { end_date: { gte: currentDate } }, // end_date >= current date (promotion hasn't ended)
            ],
          },
          orderBy: {
            finall_price: 'asc', // Get the lowest price first
          },
          include: {
            room_numbers: true,
          },
        });

        // If we have active promotions, use the lowest final price
        if (activePromotions.length > 0) {
          const lowestPricePromotion = activePromotions[0];
          bestPrice = lowestPricePromotion.finall_price;

          priceDetails = {
            standard_price: roomType.room_type_price,
            promotional_price: bestPrice,
            discount_type: lowestPricePromotion.discount_type,
            discount_amount: lowestPricePromotion.discount_amount,
            sale_name: lowestPricePromotion.name_of_sale,
            room_number: lowestPricePromotion.room_numbers.room_number,
            promotion_period: {
              starts: lowestPricePromotion.start_date,
              ends: lowestPricePromotion.end_date,
            },
          };
        }
      }

      // Transform the room_type_having_facilities into a more readable format
      const facilities = roomType.room_type_having_facilities.map(
        (facility) => ({
          id: facility.room_facility.id,
          name: facility.room_facility.room_facility_name,
        }),
      );

      // Generate a response with availability and pricing information
      const enhancedRoomType = {
        ...roomType,
        availability: {
          total_quantity: roomType.quantity_room,
          total_bookings: totalBookingsByRoomType,
          // Current availability status
          current_status: {
            date: currentDate,
            occupied_rooms: activeBookings,
            available_rooms: currentlyAvailableRooms,
            is_available: isAvailable,
          },
          // Future booking information
          future_bookings: futureBookings.map((booking) => ({
            check_in_date: booking.check_in_date,
            check_out_date: booking.check_out_date,
          })),
        },
        pricing: {
          current_best_price: bestPrice,
          standard_price: roomType.room_type_price,
          has_promotion: priceDetails !== null,
          promotion_details: priceDetails,
        },
      };

      // Create a clean response object
      const responseData = {
        id: roomType.id,
        room_type_name: roomType.room_type_name,
        description: roomType.description,
        room_type_price: bestPrice, // Use the best price (either standard or promotional)
        quantity_room: roomType.quantity_room,
        room_photo: roomType.room_photo,
        room_type_code: roomType.room_type_code,
        property: roomType.property,
        facilities: facilities,
        availability: enhancedRoomType.availability,
        pricing_details: enhancedRoomType.pricing,
      };

      // If room is not available, don't include pricing details
      if (!isAvailable) {
        return res.status(200).json({
          status: 'success',
          message: 'Room type found but not available',
          data: {
            ...responseData,
            room_type_price: null,
            pricing_details: {
              message: 'Room is not available for booking',
            },
          },
        });
      }

      return res.status(200).json({
        status: 'success',
        message:
          'Successfully retrieved room type with facilities and availability',
        data: responseData,
      });
    } catch (error) {
      console.error('Error fetching room type:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Server error occurred',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      await prisma.$disconnect();
    }
  };
