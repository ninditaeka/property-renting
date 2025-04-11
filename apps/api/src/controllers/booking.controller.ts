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
      check_in_date,
      check_out_date,
      quantity_person,
      total_price,
    } = req.body;

    // Get authenticated user

    // Validate required fields from form
    if (!full_name || !phone_number) {
      return res.status(400).json({
        status: 'error',
        message: 'Full name and phone number are required',
      });
    }

    // Create booking record in database
    const newBooking = await prisma.propertyBooking.create({
      data: {
        full_name,
        phone_number,
        property_id: parseInt(property_id),
        room_type_id: parseInt(room_type_id),
        user_id: user.id,
        check_in_date: new Date(check_in_date),
        check_out_date: new Date(check_out_date),
        quantity_person: parseInt(quantity_person),
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
