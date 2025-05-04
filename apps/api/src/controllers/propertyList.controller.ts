import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { User } from '@/types/auth.types';
import { CreatePropertyRequest } from '@/types/propertyList.type';

import {
  PropertyWithRoomTypes,
  RoomTypeWithRelations,
  PropertyResponse,
} from '@/types/availableRoom.types';
import { console } from 'inspector';

const prisma = new PrismaClient();

export const createProperty = async (req: Request, res: Response) => {
  try {
    const {
      property_name,
      province,
      city,
      address,
      description,
      property_photo,
      property_category_id,
      property_facility_ids,
      room_types,
    } = req.body as CreatePropertyRequest;

    const user = (req as Request & { user?: User }).user;
    console.log('masuk1');
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!Array.isArray(property_facility_ids)) {
      return res
        .status(400)
        .json({ message: 'Invalid property_facility_ids format' });
    }
    console.log('user.id', user.id);
    const newProperty = await prisma.property.create({
      data: {
        property_name,
        province,
        city,
        address,
        description,
        property_photo,
        property_category_id,
        created_by: user.id,

        property_having_facilities: {
          create: property_facility_ids.map((facility_id) => ({
            property_facility_id: facility_id,
          })),
        },

        room_types: {
          create: room_types.map((room) => ({
            room_type_name: room.room_type_name,
            description: room.description,
            room_type_price: room.room_type_price,
            quantity_room: room.quantity_room,
            room_photo: room.room_photo,
          })),
        },
      },
      include: {
        property_having_facilities: {
          include: { property_facility: true },
        },
        room_types: true,
      },
    });

    res.status(201).json(newProperty);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllProperty = async (req: Request, res: Response) => {
  try {
    const property = await prisma.property.findMany({
      where: { deleted: false },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Successfully retrieved all property',
      data: property,
    });
  } catch (error) {
    console.error('Failed to retrieve Property:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const getPropertybyPropertyCode = async (
  req: Request,
  res: Response,
) => {
  try {
    const { property_code } = req.params;

    if (!property_code) {
      return res.status(400).json({
        status: 'error',
        message: 'Property Category Code is required',
      });
    }

    const property = await prisma.property.findFirst({
      where: {
        property_code: property_code,
      },
    });

    if (!property) {
      return res.status(404).json({
        status: 'error',
        message: 'Property Category not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: property,
    });
  } catch (error) {
    console.error('Error fetching property category:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

// export const updatePropertybyPropertyCode = async (
//   req: Request,
//   res: Response,
// ) => {
//   try {
//     const { property_code } = req.params;
//     const {
//       property_name,
//       province,
//       city,
//       address,
//       description,
//       property_photo,
//       property_category_id,
//       property_facility_ids,
//       room_types,
//     } = req.body;

//     // Validate that property_code is provided
//     if (!property_code) {
//       return res.status(400).json({
//         status: 'error',
//         message: 'Property Code is required',
//       });
//     }

//     // Find property by property_code
//     const property = await prisma.property.findFirst({
//       where: {
//         property_code: property_code,
//       },
//       include: {
//         property_having_facilities: true,
//         room_types: true,
//       },
//     });

//     // Check if property exists
//     if (!property) {
//       return res.status(404).json({
//         status: 'error',
//         message: 'Property not found',
//       });
//     }

//     // Begin transaction to handle multiple related updates
//     const propertyUpdate = await prisma.$transaction(async (tx) => {
//       // Update base property information
//       const updatedProperty = await tx.property.update({
//         where: {
//           property_code: property_code,
//         },
//         data: {
//           property_name: property_name || property.property_name,
//           province: province || property.province,
//           city: city || property.city,
//           address: address || property.address,
//           description: description || property.description,
//           property_photo: property_photo || property.property_photo,
//           property_category_id:
//             property_category_id || property.property_category_id,
//         },
//       });
//       console.log('update0');
//       if (Array.isArray(property_facility_ids)) {
//         console.log('update1');
//         await tx.propertyHavingFacility.deleteMany({
//           where: {
//             property_id: property.id,
//           },
//         });
//         console.log('update2');

//         await tx.propertyHavingFacility.createMany({
//           data: property_facility_ids.map((facility_id) => ({
//             property_id: property.id,
//             property_facility_id: facility_id,
//           })),
//         });
//       }

//       if (Array.isArray(room_types) && room_types.length > 0) {
//         for (const roomType of room_types) {
//           if (roomType.id) {
//             await tx.roomType.update({
//               where: {
//                 id: roomType.id,
//               },
//               data: {
//                 room_type_name: roomType.room_type_name,
//                 description: roomType.description,
//                 room_type_price: roomType.room_type_price,
//                 quantity_room: roomType.quantity_room,
//                 room_photo: roomType.room_photo,
//               },
//             });
//           } else {
//             await tx.roomType.create({
//               data: {
//                 property_id: property.id,
//                 room_type_name: roomType.room_type_name,
//                 description: roomType.description,
//                 room_type_price: roomType.room_type_price,
//                 quantity_room: roomType.quantity_room,
//                 room_photo: roomType.room_photo,
//               },
//             });
//           }
//         }
//       }

//       return tx.property.findFirst({
//         where: {
//           property_code: property_code,
//         },
//         include: {
//           property_having_facilities: {
//             include: { property_facility: true },
//           },
//           room_types: true,
//         },
//       });
//     });

//     return res.status(200).json({
//       status: 'success',
//       message: 'Update property success',
//       data: propertyUpdate,
//     });
//   } catch (error) {
//     console.error('Error updating property:', error);
//     return res.status(500).json({
//       status: 'error',
//       message: 'Internal server error',
//       error: error instanceof Error ? error.message : 'Unknown error',
//     });
//   } finally {
//     await prisma.$disconnect();
//   }
// };

// export const updatePropertybyPropertyCode = async (
//   req: Request,
//   res: Response,
// ) => {
//   try {
//     const { property_code } = req.params;
//     const {
//       property_name,
//       province,
//       city,
//       address,
//       description,
//       property_photo,
//       property_category_id,
//       property_facility_ids,
//       room_types,
//     } = req.body;

//     // Validate that property_code is provided
//     if (!property_code) {
//       return res.status(400).json({
//         status: 'error',
//         message: 'Property Code is required',
//       });
//     }

//     // Find property by property_code
//     const property = await prisma.property.findFirst({
//       where: {
//         property_code: property_code,
//       },
//       include: {
//         property_having_facilities: true,
//         room_types: true,
//       },
//     });

//     // Check if property exists
//     if (!property) {
//       return res.status(404).json({
//         status: 'error',
//         message: 'Property not found',
//       });
//     }

//     // Begin transaction to handle multiple related updates
//     const propertyUpdate = await prisma.$transaction(async (tx) => {
//       // Update base property information
//       const updatedProperty = await tx.property.update({
//         where: {
//           property_code: property_code,
//         },
//         data: {
//           property_name: property_name || property.property_name,
//           province: province || property.province,
//           city: city || property.city,
//           address: address || property.address,
//           description: description || property.description,
//           property_photo: property_photo || property.property_photo,
//           property_category_id:
//             property_category_id || property.property_category_id,
//         },
//       });

//       // Handle property facilities - delete all existing and create new ones
//       if (Array.isArray(property_facility_ids)) {
//         await tx.propertyHavingFacility.deleteMany({
//           where: {
//             property_id: property.id,
//           },
//         });

//         await tx.propertyHavingFacility.createMany({
//           data: property_facility_ids.map((facility_id) => ({
//             property_id: property.id,
//             property_facility_id: facility_id,
//           })),
//         });
//       }

//       // Handle room types
//       if (Array.isArray(room_types)) {
//         // Get all existing room type IDs for this property
//         const existingRoomTypeIds = property.room_types.map((room) => room.id);

//         // Create a set of room type IDs from the request for faster lookups
//         const requestRoomTypeIds = new Set(
//           room_types
//             .filter((roomType) => roomType.id)
//             .map((roomType) => roomType.id),
//         );

//         // Delete room types that are not included in the request
//         const roomTypesToDelete = existingRoomTypeIds.filter(
//           (id) => !requestRoomTypeIds.has(id),
//         );
//         if (roomTypesToDelete.length > 0) {
//           await tx.roomType.deleteMany({
//             where: {
//               id: {
//                 in: roomTypesToDelete,
//               },
//             },
//           });
//         }

//         // Update or create room types
//         for (const roomType of room_types) {
//           if (roomType.id) {
//             // Update existing room type
//             await tx.roomType.update({
//               where: {
//                 id: roomType.id,
//               },
//               data: {
//                 room_type_name: roomType.room_type_name,
//                 description: roomType.description,
//                 room_type_price: roomType.room_type_price,
//                 quantity_room: roomType.quantity_room,
//                 room_photo: roomType.room_photo,
//               },
//             });
//           } else {
//             // Create new room type
//             await tx.roomType.create({
//               data: {
//                 property_id: property.id,
//                 room_type_name: roomType.room_type_name,
//                 description: roomType.description,
//                 room_type_price: roomType.room_type_price,
//                 quantity_room: roomType.quantity_room,
//                 room_photo: roomType.room_photo,
//               },
//             });
//           }
//         }
//       }

//       return tx.property.findFirst({
//         where: {
//           property_code: property_code,
//         },
//         include: {
//           property_having_facilities: {
//             include: { property_facility: true },
//           },
//           room_types: true,
//         },
//       });
//     });

//     return res.status(200).json({
//       status: 'success',
//       message: 'Update property success',
//       data: propertyUpdate,
//     });
//   } catch (error) {
//     console.error('Error updating property:', error);
//     return res.status(500).json({
//       status: 'error',
//       message: 'Internal server error',
//       error: error instanceof Error ? error.message : 'Unknown error',
//     });
//   } finally {
//     await prisma.$disconnect();
//   }
// };

export const updatePropertybyPropertyCode = async (
  req: Request,
  res: Response,
) => {
  try {
    const { property_code } = req.params;
    const {
      property_name,
      province,
      city,
      address,
      description,
      property_photo,
      property_category_id,
      property_facility_ids,
      room_types,
    } = req.body;

    // Validate that property_code is provided
    if (!property_code) {
      return res.status(400).json({
        status: 'error',
        message: 'Property Code is required',
      });
    }

    // Find property by property_code
    const property = await prisma.property.findFirst({
      where: {
        property_code: property_code,
      },
      include: {
        property_having_facilities: true,
        room_types: true,
      },
    });

    // Check if property exists
    if (!property) {
      return res.status(404).json({
        status: 'error',
        message: 'Property not found',
      });
    }

    // Begin transaction to handle multiple related updates
    const propertyUpdate = await prisma.$transaction(async (tx) => {
      // Update base property information
      const updatedProperty = await tx.property.update({
        where: {
          property_code: property_code,
        },
        data: {
          property_name: property_name || property.property_name,
          province: province || property.province,
          city: city || property.city,
          address: address || property.address,
          description: description || property.description,
          property_photo: property_photo || property.property_photo,
          property_category_id:
            property_category_id || property.property_category_id,
        },
      });

      // Handle property facilities - delete all existing and create new ones
      if (Array.isArray(property_facility_ids)) {
        await tx.propertyHavingFacility.deleteMany({
          where: {
            property_id: property.id,
          },
        });

        await tx.propertyHavingFacility.createMany({
          data: property_facility_ids.map((facility_id) => ({
            property_id: property.id,
            property_facility_id: facility_id,
          })),
        });
      }

      // Handle room types
      if (Array.isArray(room_types)) {
        // Create a map of existing room types for faster lookups
        const existingRoomTypesMap = new Map(
          property.room_types.map((room) => [room.id, room]),
        );

        // Track which room types we've processed to determine which to delete
        const processedRoomTypeIds = new Set();

        // Update or create room types
        for (const roomType of room_types) {
          if (roomType.id && existingRoomTypesMap.has(roomType.id)) {
            // Update existing room type
            processedRoomTypeIds.add(roomType.id);
            await tx.roomType.update({
              where: {
                id: roomType.id,
              },
              data: {
                room_type_name: roomType.room_type_name,
                description: roomType.description,
                room_type_price: roomType.room_type_price,
                quantity_room: roomType.quantity_room,
                room_photo: roomType.room_photo,
              },
            });
          } else {
            // Create new room type
            const newRoomType = await tx.roomType.create({
              data: {
                property_id: property.id,
                room_type_name: roomType.room_type_name,
                description: roomType.description,
                room_type_price: roomType.room_type_price,
                quantity_room: roomType.quantity_room,
                room_photo: roomType.room_photo,
              },
            });
            processedRoomTypeIds.add(newRoomType.id);
          }
        }

        // Delete room types that weren't in the request
        const roomTypesToDelete = [...existingRoomTypesMap.keys()].filter(
          (id) => !processedRoomTypeIds.has(id),
        );

        if (roomTypesToDelete.length > 0) {
          await tx.roomType.deleteMany({
            where: {
              id: {
                in: roomTypesToDelete,
              },
            },
          });
        }
      }

      return tx.property.findFirst({
        where: {
          property_code: property_code,
        },
        include: {
          property_having_facilities: {
            include: { property_facility: true },
          },
          room_types: true,
        },
      });
    });

    return res.status(200).json({
      status: 'success',
      message: 'Update property success',
      data: propertyUpdate,
    });
  } catch (error) {
    console.error('Error updating property:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const deletePropertybyPropertyCode = async (
  req: Request,
  res: Response,
) => {
  try {
    const { property_code } = req.params;
    console.log('property code:', property_code);
    if (!property_code) {
      return res.status(400).json({
        status: 'error',
        message: 'Property Code is required',
      });
    }

    // Begin transaction to ensure all related records are updated
    const deletedProperty = await prisma.$transaction(async (prismaClient) => {
      // First, find the property to get its ID
      const property = await prismaClient.property.findUnique({
        where: { property_code },
        include: {
          room_types: true,
          property_having_facilities: true,
        },
      });

      if (!property) {
        throw new Error('Property not found');
      }

      // 1. Mark all room type having facilities as deleted
      for (const roomType of property.room_types) {
        await prismaClient.roomTypeHavingFacility.updateMany({
          where: { room_type_id: roomType.id },
          data: { deleted: true },
        });
      }

      // 2. Mark all room numbers as deleted
      for (const roomType of property.room_types) {
        await prismaClient.roomNumber.updateMany({
          where: { room_type_id: roomType.id },
          data: { deleted: true },
        });
      }

      // 3. Mark all room types as deleted
      await prismaClient.roomType.updateMany({
        where: { property_id: property.id },
        data: { deleted: true },
      });

      // 4. Mark all property having facilities as deleted
      await prismaClient.propertyHavingFacility.updateMany({
        where: { property_id: property.id },
        data: { deleted: true },
      });

      // 5. Finally, mark the property itself as deleted
      return await prismaClient.property.update({
        where: { property_code },
        data: { deleted: true },
      });
    });

    return res.status(200).json({
      status: 'success',
      message: 'Property and related records soft deleted successfully',
      property_code: deletedProperty.property_code,
    });
  } catch (error) {
    console.error('Error soft deleting property:', error);

    if (error instanceof Error && error.message === 'Property not found') {
      return res.status(404).json({
        status: 'error',
        message: 'Property not found',
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

// export const getDetailedPropertiesByCity = async (
//   req: Request,
//   res: Response,
// ): Promise<Response> => {
//   try {
//     const city = req.query.city as string;
//     const currentDate = new Date();

//     if (!city) {
//       return res.status(400).json({
//         success: false,
//         message: 'City parameter is required',
//       });
//     }

//     // Get properties by city with their room types, room numbers, and facilities
//     const properties = await prisma.property.findMany({
//       where: {
//         city: {
//           contains: city,
//           mode: 'insensitive',
//         },
//         deleted: false,
//       },
//       include: {
//         room_types: {
//           where: {
//             deleted: false,
//           },
//           include: {
//             room_number: {
//               where: {
//                 deleted: false,
//               },
//               include: {
//                 property_price_history: {
//                   where: {
//                     start_date: { lte: currentDate },
//                     end_date: { gte: currentDate },
//                   },
//                 },
//               },
//             },
//             room_type_having_facilities: {
//               include: {
//                 room_facility: true,
//               },
//             },
//           },
//         },
//         property_having_facilities: {
//           where: {
//             deleted: false,
//           },
//           include: {
//             property_facility: true,
//           },
//         },
//       },
//     });

//     // Process properties to add detailed information
//     const detailedProperties = properties.map((property) => {
//       // Calculate property-level lowest price
//       let propertyLowestPrice = Number.MAX_SAFE_INTEGER;
//       let propertyPriceSource: string | null = null;
//       let propertyPromotionDetails: PromotionDetails | null = null;

//       // Process room types to include lowest price information
//       const roomTypesWithPricing = property.room_types.map((roomType) => {
//         let lowestPrice = roomType.room_type_price;
//         let priceSource = 'regular';
//         let promotionDetails: PromotionDetails | null = null;

//         // Check for active promotions for each room number
//         roomType.room_number.forEach((roomNumber) => {
//           const activePromotions = roomNumber.property_price_history;

//           if (activePromotions && activePromotions.length > 0) {
//             // Find the lowest promotion price for this room number
//             activePromotions.forEach((promo) => {
//               if (promo.finall_price < lowestPrice) {
//                 lowestPrice = promo.finall_price;
//                 priceSource = 'promotion';
//                 promotionDetails = {
//                   name: promo.name_of_sale,
//                   discountType: promo.discount_type,
//                   discountAmount: promo.discount_amount,
//                   roomNumber: roomNumber.room_number,
//                   roomType: roomType.room_type_name,
//                   startDate: promo.start_date,
//                   endDate: promo.end_date,
//                 };
//               }
//             });
//           }
//         });

//         // Update property-level lowest price if this room type has a lower price
//         if (lowestPrice < propertyLowestPrice) {
//           propertyLowestPrice = lowestPrice;
//           propertyPriceSource = priceSource;
//           propertyPromotionDetails = promotionDetails;
//         }

//         // Format facilities
//         const facilities = roomType.room_type_having_facilities.map(
//           (facility) => ({
//             id: facility.room_facility.id,
//             name: facility.room_facility.room_facility_name,
//           }),
//         );

//         return {
//           id: roomType.id,
//           room_type_code: roomType.room_type_code,
//           name: roomType.room_type_name,
//           description: roomType.description,
//           original_price: roomType.room_type_price,
//           current_price: lowestPrice,
//           price_source: priceSource,
//           promotion_details: promotionDetails,
//           quantity_room: roomType.quantity_room,
//           room_photo: roomType.room_photo,
//           facilities: facilities,
//         };
//       });

//       // If no room types found, set a default message
//       if (propertyLowestPrice === Number.MAX_SAFE_INTEGER) {
//         propertyLowestPrice = 0;
//         propertyPriceSource = 'unavailable';
//       }

//       // Format property facilities
//       const propertyFacilities = property.property_having_facilities.map(
//         (facility) => ({
//           id: facility.property_facility.id,
//           name: facility.property_facility.property_facility_name,
//         }),
//       );

//       // Create a formatted property object with relevant information
//       return {
//         id: property.id,
//         property_code: property.property_code,
//         property_name: property.property_name,
//         address: property.address,
//         city: property.city,
//         province: property.province,
//         description: property.description,
//         property_photo: property.property_photo,
//         lowest_price: propertyLowestPrice,
//         price_source: propertyPriceSource,
//         promotion_details: propertyPromotionDetails,
//         facilities: propertyFacilities,
//         room_types: roomTypesWithPricing,
//         room_types_count: property.room_types.length,
//         created_at: property.createdAt,
//       };
//     });

//     return res.status(200).json({
//       success: true,
//       count: detailedProperties.length,
//       data: detailedProperties,
//     });
//   } catch (error: unknown) {
//     console.error('Error fetching detailed properties by city:', error);
//     const errorMessage =
//       error instanceof Error ? error.message : 'Unknown error';
//     return res.status(500).json({
//       success: false,
//       message: 'Server error while fetching detailed properties',
//       error: errorMessage,
//     });
//   }
// };

export const getAvailableRoomTypesByPropertyCode = async (
  req: Request,
  res: Response<PropertyResponse>,
): Promise<Response<PropertyResponse>> => {
  console.log('masuk 1');
  try {
    const property_code = req.query.property_code as string;

    // Validate required parameter
    if (!property_code) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameter: property_code is required',
      });
    }

    // Get current date for check-in and check-out dates
    const currentDate = new Date();
    const checkInDate = currentDate;
    const checkOutDate = new Date(currentDate);
    checkOutDate.setDate(checkOutDate.getDate() + 1); // Default to next day checkout

    // Find the property by its code
    const property = (await prisma.property.findUnique({
      where: {
        property_code: property_code,
        deleted: false,
      },
      include: {
        room_types: {
          where: {
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
            room_number: {
              where: {
                deleted: false,
              },
            },
          },
        },
      },
    })) as PropertyWithRoomTypes | null;

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: 'Property not found' });
    }

    // Process each room type to check availability
    const availableRoomTypesPromises = property.room_types.map(
      async (roomType: RoomTypeWithRelations) => {
        // Count how many bookings exist for this room type in the given date range
        const bookingsCount = await prisma.propertyBooking.count({
          where: {
            room_type_id: roomType.id,
            property_id: property.id,
            OR: [
              {
                AND: [
                  { check_in_date: { lte: checkInDate } },
                  { check_out_date: { gte: checkInDate } },
                ],
              },
              {
                AND: [
                  { check_in_date: { lte: checkOutDate } },
                  { check_out_date: { gte: checkOutDate } },
                ],
              },
              {
                AND: [
                  { check_in_date: { gte: checkInDate } },
                  { check_out_date: { lte: checkOutDate } },
                ],
              },
            ],
          },
        });

        // Calculate available rooms
        const availableRooms = roomType.quantity_room - bookingsCount;

        // Only return room types that have available rooms
        if (availableRooms > 0) {
          return {
            ...roomType,
            available_rooms: availableRooms,
            is_available: true,
          };
        }
        return null;
      },
    );

    // Wait for all promises to resolve
    const roomTypesWithAvailability = await Promise.all(
      availableRoomTypesPromises,
    );

    // Filter out null values (room types with no availability)
    const availableRoomTypes = roomTypesWithAvailability.filter(
      (
        rt,
      ): rt is RoomTypeWithRelations & {
        available_rooms: number;
        is_available: boolean;
      } => rt !== null,
    );

    return res.status(200).json({
      success: true,
      property: {
        id: property.id,
        property_name: property.property_name,
        property_code: property.property_code,
        address: property.address,
        city: property.city,
        province: property.province,
      },
      available_room_types: availableRoomTypes,
    });
  } catch (error: unknown) {
    console.error('Error fetching available room types:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching room types',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getPropertyListByCityAfterSearchLandingPage = async (
  req: Request,
  res: Response,
) => {
  console.log('1. Request received');
  try {
    const city = req.query.city;
    const checkInDate = req.query['check-in'];
    const checkOutDate = req.query['check-out'];
    const rooms = req.query.rooms;
    console.log('2. Parameters extracted:', {
      city,
      checkInDate,
      checkOutDate,
      rooms,
    });

    if (!checkInDate || !checkOutDate || !city || !rooms) {
      console.log('3. Missing parameters');
      return res.status(400).json({
        message:
          'Missing required parameters: checkInDate, checkOutDate, city, numberOfRooms aaaa',
      });
    }

    // Convert numberOfRooms to integer
    const roomsNeeded = parseInt(rooms as string);
    console.log('4. Rooms needed:', roomsNeeded);

    console.log('5. About to execute SQL query');

    // First, get properties with active room types in the specified city
    const properties = await prisma.$queryRaw`
      WITH 
         currentBookings AS (
        SELECT COUNT(DISTINCT(pb.room_type_id)) AS y, property_id
        FROM property_bookings pb
        WHERE pb.check_in_date = TO_DATE(${checkInDate as string}, 'DD-MM-YYYY') 
        AND pb.check_out_date = TO_DATE(${checkOutDate as string}, 'DD-MM-YYYY')
        GROUP BY property_id
      ), 
      activeRoomCount AS (
         SELECT
           property_id,
           COUNT(id)::text AS active_room_count
         FROM room_types
         WHERE deleted = false
         GROUP BY property_id
       ),
     availableCount AS (
         SELECT
           rt.property_id,
           COUNT(1)::text AS totalRoom,
           COALESCE(y, 0)::text AS bookedRoom
         FROM room_types rt
         LEFT JOIN currentBookings cb ON rt.property_id = cb.property_id
         WHERE rt.deleted = false
         GROUP BY rt.property_id, y
       ),
       availableProperty AS (
    SELECT
        p.id AS property_id,
        ac.totalroom AS total_rooms,
        ac.bookedRoom AS booked_rooms,
        CASE 
            WHEN arc.active_room_count IS NULL OR arc.active_room_count = '0' THEN 'unavailable'
            WHEN ac.totalroom::numeric > ac.bookedRoom::numeric THEN 'available'
            ELSE 'fullbooked'
        END AS availability_status
    FROM properties p
    LEFT JOIN activeRoomCount arc ON p.id = arc.property_id
    LEFT JOIN availableCount ac ON p.id = ac.property_id
    WHERE p.deleted = false
  and  p.city=${city} 
),
lowestPriceInfo AS (
    SELECT 
        rt.property_id,
        LEAST(
            MIN(rt.room_type_price),
            COALESCE(MIN(pph.finall_price), MIN(rt.room_type_price))
        ) AS lowest_price
    FROM room_types rt
    LEFT JOIN room_numbers rn ON rt.id = rn.room_type_id AND rn.deleted = false
    LEFT JOIN property_price_histories pph ON pph.room_numbers_id = rn.id 
        AND CURRENT_DATE BETWEEN pph.start_date AND pph.end_date
    WHERE rt.deleted = false
    GROUP BY rt.property_id
  ),
  listProperty AS (
    SELECT
        p.id,
        p.property_name,
        p.property_photo,
        p.city,
        p.province,
        p.property_code,
        STRING_AGG(pf.property_facility_name, ', ' ORDER BY pf.property_facility_name) AS facilities
    FROM properties p
    LEFT JOIN property_having_facilities phf ON p.id = phf.property_id AND phf.deleted = false
    LEFT JOIN property_facilities pf ON phf.property_facility_id = pf.id
    WHERE p.deleted = false
    GROUP BY p.id, p.property_name,p.property_photo
    ORDER BY p.id
),listPropertyFinall AS (
SELECT
    lp.id,
    lp.property_name,
    lp.property_photo,
    lp.city,
    lp.province,
    lp.facilities,
    lp.property_code,
    ap.total_rooms,
    ap.booked_rooms,
    ap.availability_status,
    CASE 
        WHEN ap.availability_status = 'unavailable' THEN NULL
        ELSE lpi.lowest_price
    END AS lowest_price
FROM listProperty lp
JOIN availableProperty ap ON lp.id = ap.property_id
LEFT JOIN lowestPriceInfo lpi ON lp.id = lpi.property_id
)   
       SELECT * FROM listPropertyFinall
    `;
    // const properties = {};
    console.log('6. Query executed successfully');

    return res.send({
      status: 'success',
      message: 'Property list retrieved successfully',
      data: properties,
    });
  } catch (error) {
    console.error('Error getting property list by city:', error);
    return res.status(500).json({
      status: 'error',
      message: error,
    });
  }
};
