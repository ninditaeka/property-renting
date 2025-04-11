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
