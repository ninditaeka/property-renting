import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { User } from '@/types/auth.types';
const prisma = new PrismaClient();

export const createBooking = async (req: Request, res: Response) => {
  try {
    // Get form data from request body
    const { full_name, phone_number } = req.body;
    const user = req.user as unknown as User;

    // Get booking details from state management (passed from frontend)
    const {
      property_id,
      room_type_id,
      'check-in': checkIn, // Changed from check_in_date to check-in
      'check-out': checkOut, // Changed from check_out_date to check-out
      quantity_person = null,
      total_price,
      room_number_booking,
    } = req.body;

    // Validate required fields from form
    if (!full_name || !phone_number) {
      return res.status(400).json({
        status: 'error',
        message: 'Full name and phone number are required',
      });
    }

    // Convert dates from DD-MM-YYYY format to Date objects
    const parseDateFromDDMMYYYY = (dateString: string): Date => {
      const [day, month, year] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day); // Month is 0-indexed in JS Date
    };

    const checkInDate = parseDateFromDDMMYYYY(checkIn);
    const checkOutDate = parseDateFromDDMMYYYY(checkOut);

    // Create booking record in database
    const newBooking = await prisma.propertyBooking.create({
      data: {
        full_name,
        phone_number,
        property_id: parseInt(property_id),
        room_type_id: parseInt(room_type_id),
        user_id: user.id,
        room_number_booking: parseInt(room_number_booking),
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        quantity_person: quantity_person ? parseInt(quantity_person) : 0,
        total_price: parseInt(total_price),
      },
    });

    return res.status(201).json({
      status: 'success',
      message: 'Booking created successfully',
      data: newBooking,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create booking',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};
export const getBookingsByUserCode = async (req: Request, res: Response) => {
  try {
    const { user_code } = req.params; // Assuming user_code is passed in the URL parameters

    // First find the user by user_code
    const user = await prisma.user.findUnique({
      where: {
        user_code: user_code,
      },
    });

    // If user not found, return 404 response
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    // Then fetch the bookings with the user's ID and only the specific fields needed
    const bookings = await prisma.propertyBooking.findMany({
      where: {
        user_id: user.id,
      },
      select: {
        check_in_date: true,
        check_out_date: true,
        room_number_booking: true,
        user: {
          select: {
            name: true,
          },
        },
        property: {
          select: {
            property_name: true,
          },
        },
        room_type: {
          select: {
            room_type_name: true,
          },
        },
      },
    });

    // Transform the data for a cleaner response format
    const formattedBookings = bookings.map((booking) => ({
      name: booking.user.name,
      property_name: booking.property.property_name,
      room_type_name: booking.room_type.room_type_name,
      room_number_booking: booking.room_number_booking,
      check_in_date: booking.check_in_date,
      check_out_date: booking.check_out_date,
    }));

    // Return the formatted bookings data
    return res.status(200).json({
      status: 'success',
      data: formattedBookings,
    });
  } catch (error: unknown) {
    console.error('Error fetching bookings by user code:', error);

    // Properly handle the unknown error type
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';

    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch bookings',
      error: errorMessage,
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const getRoomPricingByDateRangebyRoomTypeCode = async (
  req: Request,
  res: Response,
) => {
  try {
    const { room_type_code, room_number } = req.params;
    const { start_date, end_date } = req.query;

    // Validate inputs
    if (!room_type_code) {
      return res.status(400).json({
        status: 'error',
        message: 'Room type code is required',
      });
    }

    // Default date range if not provided
    const startDate = start_date ? new Date(start_date as string) : new Date();
    const endDate = end_date
      ? new Date(end_date as string)
      : new Date(startDate.getTime() + 4 * 24 * 60 * 60 * 1000); // Default to 5 days

    // Generate array of dates in the range
    const dateRange = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dateRange.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Get the room type to validate it exists
    const roomType = await prisma.roomType.findUnique({
      where: {
        room_type_code: room_type_code,
        deleted: false,
      },
      include: {
        property: {
          select: {
            id: true,
            property_name: true,
            deleted: true,
          },
        },
      },
    });

    if (!roomType || roomType.deleted || roomType.property.deleted) {
      return res.status(404).json({
        status: 'error',
        message: 'Room type not found or inactive',
      });
    }

    // Filter by room number if provided
    const roomNumberFilter = room_number ? { room_number } : {};

    // Get all room numbers for this room type
    const roomNumbers = await prisma.roomNumber.findMany({
      where: {
        room_type_id: roomType.id,
        deleted: false,
        ...roomNumberFilter,
      },
    });

    if (roomNumbers.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: room_number
          ? `Room number ${room_number} not found`
          : 'No rooms available for this room type',
      });
    }

    // Prepare the result data
    const pricingData = [];

    // For each room number and date, get the pricing information
    for (const roomNum of roomNumbers) {
      for (const date of dateRange) {
        // Format date for comparison
        const formattedDate = date.toISOString().split('T')[0];

        // Get special pricing if available for this date and room
        const specialPricing = await prisma.propertyPriceHistory.findFirst({
          where: {
            room_numbers_id: roomNum.id,
            start_date: {
              lte: new Date(formattedDate),
            },
            end_date: {
              gte: new Date(formattedDate),
            },
          },
          orderBy: {
            finall_price: 'asc',
          },
        });

        pricingData.push({
          property_name: roomType.property.property_name,
          room_type_name: roomType.room_type_name,
          room_number: roomNum.room_number,
          stay_date: formattedDate,
          price: specialPricing
            ? specialPricing.finall_price
            : roomType.room_type_price,
          price_type: specialPricing ? 'Special Price' : 'Default Price',
        });
      }
    }

    // Sort the data
    pricingData.sort((a, b) => {
      if (a.room_number !== b.room_number) {
        return a.room_number.localeCompare(b.room_number);
      }
      return new Date(a.stay_date).getTime() - new Date(b.stay_date).getTime();
    });

    return res.status(200).json({
      status: 'success',
      data: pricingData,
    });
  } catch (error: unknown) {
    console.error('Error fetching room pricing:', error);

    // Properly handle the unknown error type
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';

    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch room pricing information',
      error: errorMessage,
    });
  } finally {
    await prisma.$disconnect();
  }
};

const parseDateString = (dateString: string): Date | null => {
  const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
  const match = dateString.match(dateRegex);

  if (!match) {
    return null;
  }

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1; // JS months are 0-indexed
  const year = parseInt(match[3], 10);

  // Create the date object (set time to noon to avoid timezone issues)
  const date = new Date(year, month, day, 12, 0, 0);

  // Validate the date is legitimate
  if (
    date.getDate() !== day ||
    date.getMonth() !== month ||
    date.getFullYear() !== year
  ) {
    return null; // This handles cases like 31-02-2025 (invalid date)
  }

  return date;
};

// Add this function to parse different date formats
function parseDateFlexible(dateString: string): Date | null {
  // First try DD-MM-YYYY format (your preferred format)
  const ddmmyyyyPattern = /^(\d{2})-(\d{2})-(\d{4})$/;
  if (ddmmyyyyPattern.test(dateString)) {
    const [_, day, month, year] = ddmmyyyyPattern.exec(dateString) || [];
    // Month is 0-indexed in JavaScript Date
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    // Check if valid date (handles cases like 31-02-2025)
    if (
      date.getDate() === Number(day) &&
      date.getMonth() === Number(month) - 1 &&
      date.getFullYear() === Number(year)
    ) {
      return date;
    }
    return null;
  }

  // Try ISO format (YYYY-MM-DD with or without time)
  try {
    const date = new Date(dateString);
    // Check if valid date
    if (!isNaN(date.getTime())) {
      return date;
    }
  } catch (e) {
    // Parsing failed
  }

  return null;
}

// This formats a date object to DD-MM-YYYY string (for debugging/display)
function formatDateToDDMMYYYY(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export const getRoomNumberinBookingByRoomTypeCode = async (
  req: Request,
  res: Response,
) => {
  try {
    const { roomTypeCode, checkInDate, checkOutDate } = req.query;

    // Validate required parameters
    if (!roomTypeCode) {
      return res.status(400).json({
        status: 'error',
        message: 'Room type code is required',
      });
    }
    console.log('roomtypecode', roomTypeCode);

    // Parse and validate dates
    let checkIn: Date | undefined;
    let checkOut: Date | undefined;

    if (checkInDate) {
      console.log('Original checkInDate from query:', checkInDate);
      const parsedCheckIn = parseDateFlexible(checkInDate as string);
      if (!parsedCheckIn) {
        return res.status(400).json({
          status: 'error',
          message:
            'Invalid check-in date format. Please use DD-MM-YYYY format (e.g., 23-04-2025)',
        });
      }
      console.log(
        'Parsed checkInDate as DD-MM-YYYY:',
        formatDateToDDMMYYYY(parsedCheckIn),
      );
      checkIn = parsedCheckIn;
    }

    if (checkOutDate) {
      console.log('Original checkOutDate from query:', checkOutDate);
      const parsedCheckOut = parseDateFlexible(checkOutDate as string);
      if (!parsedCheckOut) {
        return res.status(400).json({
          status: 'error',
          message:
            'Invalid check-out date format. Please use DD-MM-YYYY format (e.g., 25-04-2025)',
        });
      }
      console.log(
        'Parsed checkOutDate as DD-MM-YYYY:',
        formatDateToDDMMYYYY(parsedCheckOut),
      );
      checkOut = parsedCheckOut;
    }

    // Find the room type ID based on the provided code
    const roomType = await prisma.roomType.findUnique({
      where: {
        room_type_code: roomTypeCode as string,
        deleted: false,
      },
      select: {
        id: true,
        room_type_name: true,
      },
    });
    console.log('roomtype:', roomType);
    if (!roomType) {
      return res.status(404).json({
        status: 'error',
        message: 'Room type not found',
      });
    }

    // Get all room numbers for this room type
    const roomNumbers = await prisma.roomNumber.findMany({
      where: {
        room_type_id: roomType.id,
        deleted: false,
      },
      select: {
        id: true,
        room_number: true,
        room_type_id: true,
      },
    });

    // If dates are provided, filter out booked rooms
    let availableRooms = roomNumbers;

    if (checkIn && checkOut) {
      // Get all booked room numbers for the specified date range
      const bookings = await prisma.propertyBooking.findMany({
        where: {
          room_type_id: roomType.id,
          OR: [
            {
              // Check if the booking overlaps with the requested period
              AND: [
                { check_in_date: { lte: checkOut } },
                { check_out_date: { gte: checkIn } },
              ],
            },
          ],
        },
        select: {
          room_number_booking: true,
        },
      });

      // Extract booked room IDs
      const bookedRoomIds = bookings.map(
        (booking) => booking.room_number_booking,
      );

      // Filter out booked rooms
      availableRooms = roomNumbers.filter(
        (room) => !bookedRoomIds.includes(room.id),
      );
    }

    // Format the response to match the expected output
    const formattedRooms = availableRooms.map((room) => ({
      room_number: room.room_number,
      room_type_id: room.room_type_id,
      room_type_name: roomType.room_type_name,
    }));

    return res.status(200).json({
      status: 'success',
      message: 'Available room numbers retrieved successfully',
      data: formattedRooms,
    });
  } catch (error) {
    console.error('Error retrieving available room numbers:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve available room numbers',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};

export const getRoomNumberSelectedByRoomTypeCodeLowestPrice = async (
  req: Request,
  res: Response,
) => {
  try {
    // Get room_type_code from route params and date parameters from query
    const { room_type_code } = req.params;
    const { 'check-in': checkInParam, 'check-out': checkOutParam } = req.query;

    // Validate required parameters
    if (!room_type_code || !checkInParam || !checkOutParam) {
      return res.status(400).json({
        status: 'error',
        message:
          'Room type code, check-in date, and check-out date are required',
      });
    }

    // Validate date format (DD-MM-YYYY)
    const checkInStr = checkInParam as string;
    const checkOutStr = checkOutParam as string;

    // Check if format matches DD-MM-YYYY
    const dateFormatRegex = /^\d{2}-\d{2}-\d{4}$/;
    if (
      !dateFormatRegex.test(checkInStr) ||
      !dateFormatRegex.test(checkOutStr)
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Date format should be DD-MM-YYYY',
      });
    }

    // Parse the dates (DD-MM-YYYY to JavaScript Date)
    const [checkInDay, checkInMonth, checkInYear] = checkInStr
      .split('-')
      .map(Number);
    const [checkOutDay, checkOutMonth, checkOutYear] = checkOutStr
      .split('-')
      .map(Number);

    // Month is 0-indexed in JavaScript Date
    const checkInDate = new Date(checkInYear, checkInMonth - 1, checkInDay);
    const checkOutDate = new Date(checkOutYear, checkOutMonth - 1, checkOutDay);

    // Check if dates are valid
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid date values',
      });
    }

    // Run the raw SQL query to find the lowest price room
    const result = await prisma.$queryRaw`
      WITH date_range AS (
        SELECT generate_series(
          ${checkInDate}::timestamp,
          ${checkOutDate}::timestamp - INTERVAL '1 day',
          '1 day'::interval
        ) AS date_check
      ),
      -- Get all available rooms with their prices for the date range
      available_rooms AS (
        SELECT
          p.property_name,
          p.id AS property_id,
          rt.room_type_name,
          rt.room_type_code,
          rn.room_number,
          rt.id AS room_type_id,
          rn.id AS room_number_id,
          date_range.date_check::date AS stay_date,
          COALESCE(
            (
              SELECT pph.finall_price
              FROM "property_price_histories" pph
              WHERE pph.room_numbers_id = rn.id
              AND date_range.date_check >= pph.start_date::date
              AND date_range.date_check <= pph.end_date::date
              AND pph.end_date IS NOT NULL
              AND pph.start_date IS NOT NULL
              ORDER BY pph.finall_price ASC
              LIMIT 1
            ),
            rt.room_type_price
          ) AS price,
          CASE
            WHEN (
              SELECT pph.finall_price
              FROM "property_price_histories" pph
              WHERE pph.room_numbers_id = rn.id
              AND date_range.date_check >= pph.start_date::date
              AND date_range.date_check <= pph.end_date::date
              AND pph.end_date IS NOT NULL
              AND pph.start_date IS NOT NULL
              LIMIT 1
            ) IS NOT NULL THEN 'Special Price'
            ELSE 'Default Price'
          END AS price_type
        FROM
          "room_types" rt
        JOIN
          "properties" p ON rt.property_id = p.id
        JOIN
          "room_numbers" rn ON rt.id = rn.room_type_id
        CROSS JOIN
          date_range
        WHERE
          rt.deleted = false
          AND p.deleted = false
          AND rn.deleted = false
          AND rn.id NOT IN (
            -- Exclude rooms that are already booked for any day in the date range
            SELECT pb.room_number_booking
            FROM "property_bookings" pb
            WHERE (
              (pb.check_in_date <= date_range.date_check AND pb.check_out_date > date_range.date_check)
            )
          )
      ),
      -- Calculate total price for each room across the entire date range
      room_price_summary AS (
        SELECT
          property_name,
          property_id,
          room_type_name,
          room_type_code,
          room_number,
          room_type_id,
          room_number_id,
          SUM(price)::float AS total_price,
          string_agg(price_type, ', ' ORDER BY stay_date) AS price_types,
          MIN(stay_date) AS first_date,
          MAX(stay_date) AS last_date,
          COUNT(*) AS days
        FROM
          available_rooms
        GROUP BY
          property_name, property_id, room_type_name, room_type_code, room_number, room_type_id, room_number_id
      ),
      -- Rank rooms by total price to find the lowest price option
      ranked_rooms AS (
        SELECT
          *,
          RANK() OVER (PARTITION BY room_type_id ORDER BY total_price ASC) AS price_rank
        FROM
          room_price_summary
      )
      -- Select the cheapest room for each room type
      SELECT
        property_name,
        property_id::text,
        room_type_name,
        room_type_code,
        room_number,
        room_number_id::text,
        first_date AS check_in_date,
        last_date + INTERVAL '1 day' AS check_out_date,
        total_price,
        (total_price / days)::float AS avg_price_per_night,
        price_types,
        days AS total_nights
      FROM
        ranked_rooms
      WHERE
        price_rank = 1
        AND room_type_id IN (
          SELECT id FROM "room_types"
          WHERE room_type_code = ${room_type_code}
        )
      ORDER BY
        total_price ASC
      LIMIT 1;
    `;

    // Check if any room was found
    if (!result || (Array.isArray(result) && result.length === 0)) {
      return res.status(404).json({
        status: 'error',
        message:
          'No available rooms found for the specified room type and date range',
      });
    }

    // Convert BigInt values to strings to avoid serialization issues
    const processedResult = Array.isArray(result)
      ? result.map((room) => {
          const processed: Record<string, any> = {};
          for (const [key, value] of Object.entries(room)) {
            processed[key] =
              typeof value === 'bigint' ? value.toString() : value;
          }
          return processed;
        })
      : Object.entries(result as Record<string, any>).reduce(
          (acc: Record<string, any>, [key, value]) => {
            acc[key] = typeof value === 'bigint' ? value.toString() : value;
            return acc;
          },
          {},
        );

    return res.status(200).json({
      status: 'success',
      message: 'Available rooms found successfully',
      data:
        Array.isArray(processedResult) && processedResult.length === 1
          ? processedResult[0]
          : processedResult,
    });
  } catch (error) {
    console.error('Error finding lowest price room:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to find lowest price room',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};
