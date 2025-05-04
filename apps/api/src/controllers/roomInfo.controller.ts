import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { User } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllRoomInfo = async (req: Request, res: Response) => {
  try {
    const user = (req as Request & { user?: User }).user;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const roomInfo = await prisma.roomNumber.findMany({
      where: {
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

    res.status(200).json(formattedRoomInfo);
  } catch (error) {
    console.error('Error fetching room information:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
