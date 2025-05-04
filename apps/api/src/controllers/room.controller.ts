import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { User } from '@/types/auth.types';
import { CreateRoomRequest } from '@/types/propertyList.type';

const prisma = new PrismaClient();

export const createRoom = async (req: Request, res: Response) => {
  try {
    const { property_id, room_type_id, room_number, room_facilities_ids } =
      req.body as CreateRoomRequest;

    const user = (req as Request & { user?: User }).user;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!Array.isArray(room_facilities_ids)) {
      console.log('cek2 user:', user);
      return res
        .status(400)
        .json({ message: 'Invalid room_facility_ids format' });
    }

    // Check if property exists and belongs to user
    const property = await prisma.property.findFirst({
      where: {
        id: property_id,
        created_by: user.id,
        deleted: false,
      },
    });

    if (!property) {
      return res
        .status(404)
        .json({ message: 'Property not found or access denied' });
    }

    // Check if room type exists and belongs to the property
    const roomType = await prisma.roomType.findFirst({
      where: {
        id: room_type_id,
        property_id: property_id,
        deleted: false,
      },
    });

    if (!roomType) {
      return res
        .status(404)
        .json({ message: 'Room type not found for this property' });
    }

    // Check if there's still capacity available for this room type
    if (roomType.quantity_room <= 0) {
      return res.status(400).json({
        message: 'No more capacity available for this room type',
      });
    }

    // Check if room number already exists for this property
    const existingRoomNumber = await prisma.roomNumber.findFirst({
      where: {
        room_number: room_number,
        room_type: {
          property_id: property_id,
        },
      },
    });

    if (existingRoomNumber) {
      return res.status(400).json({
        message: 'Room number already exists for this property',
      });
    }

    // Create room number
    const newRoomNumber = await prisma.roomNumber.create({
      data: {
        room_number: room_number,
        room_type_id: room_type_id,
      },
    });

    // Update room type capacity (decrease by 1)
    await prisma.roomType.update({
      where: {
        id: room_type_id,
      },
      data: {
        quantity_room: roomType.quantity_room - 1,
      },
    });

    // Create room facilities connections if provided
    if (room_facilities_ids.length > 0) {
      await Promise.all(
        room_facilities_ids.map(async (facilityId: number) => {
          return await prisma.roomTypeHavingFacility.create({
            data: {
              room_facility_id: facilityId,
              room_type_id: room_type_id,
            },
          });
        }),
      );
    }

    // Fetch the complete data with relations
    const createdRoom = await prisma.roomNumber.findUnique({
      where: {
        id: newRoomNumber.id,
      },
      include: {
        room_type: {
          include: {
            room_type_having_facilities: {
              include: {
                room_facility: true,
              },
            },
          },
        },
      },
    });

    return res.status(201).json({
      message: 'Room created successfully',
      data: createdRoom,
    });
  } catch (error) {
    console.error('Error creating room:', error);
    return res.status(500).json({
      message: 'Failed to create room',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getAllRoom = async (req: Request, res: Response) => {
  try {
    const room = await prisma.roomNumber.findMany();
    return res.status(200).json({
      status: 'success',
      message: 'Successfully retrieved all room',
      data: room,
    });
  } catch (error) {
    console.error('Failed to retrieve room:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    await prisma.$disconnect();
  }
};

// getRoombyRoomNumberCode

export const getRoombyRoomNumberCode = async (req: Request, res: Response) => {
  try {
    const { room_number_code } = req.params;

    if (!room_number_code) {
      return res.status(400).json({
        status: 'error',
        message: 'Room Number  Code is required',
      });
    }

    const room = await prisma.roomNumber.findFirst({
      where: {
        room_number_code: room_number_code,
      },
    });

    if (!room) {
      return res.status(404).json({
        status: 'error',
        message: 'Property Category not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: room,
    });
  } catch (error) {
    console.error('Error fetching property category:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

export const updateRoombyRoomNumberCode = async (
  req: Request,
  res: Response,
) => {
  try {
    const { room_number_code } = req.params;
    const { property_id, room_type_id, room_number, room_facilities_ids } =
      req.body as CreateRoomRequest;

    const user = (req as Request & { user?: User }).user;

    if (!user) {
      console.log('cek1 user:', user);
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!room_number_code) {
      return res.status(400).json({
        message: 'Room number code is required',
      });
    }

    if (room_facilities_ids && !Array.isArray(room_facilities_ids)) {
      return res
        .status(400)
        .json({ message: 'Invalid room_facility_ids format' });
    }

    // Fetch existing room by room_number_code
    const existingRoom = await prisma.roomNumber.findUnique({
      where: {
        room_number_code: room_number_code,
      },
      include: {
        room_type: true,
      },
    });

    if (!existingRoom) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (existingRoom.deleted) {
      return res.status(400).json({ message: 'Room has been deleted' });
    }

    // Check if property exists and belongs to user
    const property = await prisma.property.findFirst({
      where: {
        id: property_id || existingRoom.room_type.property_id,
        created_by: user.id,
        deleted: false,
      },
    });

    if (!property) {
      return res
        .status(404)
        .json({ message: 'Property not found or access denied' });
    }

    // If changing room type
    let oldRoomTypeId = existingRoom.room_type_id;
    let newRoomTypeId = room_type_id || oldRoomTypeId;

    if (room_type_id && room_type_id !== existingRoom.room_type_id) {
      // Check if new room type exists and belongs to the property
      const newRoomType = await prisma.roomType.findFirst({
        where: {
          id: room_type_id,
          property_id: property.id,
          deleted: false,
        },
      });

      if (!newRoomType) {
        return res
          .status(404)
          .json({ message: 'Room type not found for this property' });
      }

      // Check if there's still capacity available for the new room type
      if (newRoomType.quantity_room <= 0) {
        return res.status(400).json({
          message: 'No more capacity available for the new room type',
        });
      }
    }

    // Check if room number already exists for this property (if changing room number)
    if (room_number && room_number !== existingRoom.room_number) {
      const existingRoomNumber = await prisma.roomNumber.findFirst({
        where: {
          room_number: room_number,
          room_type: {
            property_id: property.id,
          },
          room_number_code: { not: room_number_code }, // Exclude current room
        },
      });

      if (existingRoomNumber) {
        return res.status(400).json({
          message: 'Room number already exists for this property',
        });
      }
    }

    // Begin transaction for updating room and related data
    const updatedRoom = await prisma.$transaction(async (tx) => {
      // Update room number
      const updated = await tx.roomNumber.update({
        where: {
          room_number_code: room_number_code,
        },
        data: {
          room_number: room_number || existingRoom.room_number,
          room_type_id: newRoomTypeId,
        },
      });

      // If room type changed, update quantity for both old and new room types
      if (newRoomTypeId !== oldRoomTypeId) {
        // Decrease quantity of new room type
        await tx.roomType.update({
          where: { id: newRoomTypeId },
          data: {
            quantity_room: {
              decrement: 1,
            },
          },
        });

        // Increase quantity of old room type
        await tx.roomType.update({
          where: { id: oldRoomTypeId },
          data: {
            quantity_room: {
              increment: 1,
            },
          },
        });
      }

      // Update room facilities if provided
      if (room_facilities_ids && room_facilities_ids.length > 0) {
        // Delete existing facilities
        await tx.roomTypeHavingFacility.deleteMany({
          where: {
            room_type_id: newRoomTypeId,
          },
        });

        // Create new facility connections
        await Promise.all(
          room_facilities_ids.map(async (facilityId: number) => {
            return await tx.roomTypeHavingFacility.create({
              data: {
                room_facility_id: facilityId,
                room_type_id: newRoomTypeId,
              },
            });
          }),
        );
      }

      return updated;
    });

    // Fetch the complete updated room with relations
    const completeUpdatedRoom = await prisma.roomNumber.findUnique({
      where: {
        room_number_code: room_number_code,
      },
      include: {
        room_type: {
          include: {
            room_type_having_facilities: {
              include: {
                room_facility: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      message: 'Room updated successfully',
      data: completeUpdatedRoom,
    });
  } catch (error) {
    console.error('Error updating room:', error);
    return res.status(500).json({
      message: 'Failed to update room',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const deleteRoomNumberbyRoomNumberCode = async (
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

    const user = (req as Request & { user?: User }).user;

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized',
      });
    }

    // Find the room number with related entities
    const roomNumber = await prisma.roomNumber.findUnique({
      where: {
        room_number_code,
      },
      include: {
        room_type: {
          include: {
            property: true,
            room_type_having_facilities: true,
          },
        },
      },
    });

    if (!roomNumber) {
      return res.status(404).json({
        status: 'error',
        message: 'Room not found',
      });
    }

    // Check if user has permission (owns the property)
    if (roomNumber.room_type.property.created_by !== user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied: You do not own this property',
      });
    }

    // Start a transaction to ensure all operations succeed or fail together
    const deletedRoom = await prisma.$transaction(async (tx) => {
      // Soft delete related facilities
      if (roomNumber.room_type.room_type_having_facilities.length > 0) {
        await tx.roomTypeHavingFacility.updateMany({
          where: {
            room_type_id: roomNumber.room_type_id,
          },
          data: {
            deleted: true,
          },
        });
      }

      // Soft delete the room number
      const deletedRoomNumber = await tx.roomNumber.update({
        where: {
          room_number_code,
        },
        data: {
          deleted: true,
        },
      });

      // Increase the room type capacity by 1
      await tx.roomType.update({
        where: { id: roomNumber.room_type_id },
        data: {
          quantity_room: {
            increment: 1,
          },
        },
      });

      return deletedRoomNumber;
    });

    return res.status(200).json({
      status: 'success',
      message: 'Room and related facilities deleted successfully',
      data: {
        room_number_code: deletedRoom.room_number_code,
        room_number: deletedRoom.room_number,
      },
    });
  } catch (error) {
    console.error('Error deleting room:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete room',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
