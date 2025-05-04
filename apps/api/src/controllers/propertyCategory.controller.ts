import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { User } from '@/types/auth.types';
import { PropertyCategory } from '@/types/propertyCategory.type';

import { toUpper } from 'lodash';

const prisma = new PrismaClient();

export const createPropertyCategory = async (req: Request, res: Response) => {
  try {
    const { property_category_name, description } =
      req.body as PropertyCategory;
    const user = req.user as User;

    const newPropertyCategory = await prisma.propertyCategory.create({
      data: {
        property_category_name: toUpper(property_category_name) || '',
        description: description || '',
        created_by: user.id,
      },
    });

    return res.status(201).json({
      status: 'success',
      message: 'Property Category is created',
      data: newPropertyCategory,
    });
  } catch (error) {
    console.error('PropertyCategory failed to create:', error);

    return res.status(500).json({
      status: 'error',
      message: 'This Property Category already create ',
    });
  } finally {
  }
};

export const getAllPropertyCategory = async (req: Request, res: Response) => {
  try {
    const propertyCategories = await prisma.propertyCategory.findMany({
      where: {
        deleted: false,
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Successfully retrieved all property categories',
      data: propertyCategories,
    });
  } catch (error) {
    console.error('Failed to retrieve Property Category:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const getPropertyCategorybyPropertyCategoryCode = async (
  req: Request,
  res: Response,
) => {
  try {
    const { property_category_code } = req.params;

    if (!property_category_code) {
      return res.status(400).json({
        status: 'error',
        message: 'Property Category Code is required',
      });
    }

    const propertyCategory = await prisma.propertyCategory.findFirst({
      where: {
        property_category_code: property_category_code,
      },
    });

    if (!propertyCategory) {
      return res.status(404).json({
        status: 'error',
        message: 'Property Category not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: propertyCategory,
    });
  } catch (error) {
    console.error('Error fetching property category:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

export const updatePropertyCategorybyPropertyCategoryCode = async (
  req: Request,
  res: Response,
) => {
  try {
    const { property_category_code } = req.params;
    const { property_category_name, description } = req.body;

    if (!property_category_code) {
      return res.status(400).json({
        status: 'error',
        message: 'Property Category Code is required',
      });
    }

    const propertyCategory = await prisma.propertyCategory.findFirst({
      where: {
        property_category_code: property_category_code,
      },
    });

    if (!propertyCategory) {
      return res.status(404).json({
        status: 'error',
        message: 'Property Category not found',
      });
    } else {
      const propertyCategoryUpdate = await prisma.propertyCategory.update({
        where: {
          property_category_code: property_category_code,
        },
        data: {
          property_category_name:
            property_category_name || propertyCategory.property_category_name,
          description: description || propertyCategory.description,
        },
      });

      return res.status(201).json({
        status: 'success',
        message: 'Update property category success',
        data: propertyCategoryUpdate,
      });
    }
  } catch (error) {
    console.error('Error updating property category:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

export const deletePropertyCategorybyPropertyCategoryCode = async (
  req: Request,
  res: Response,
) => {
  try {
    const { property_category_code } = req.params;

    if (!property_category_code) {
      return res.status(400).json({
        status: 'error',
        message: 'Property Category Code is required',
      });
    }

    const propertyCategory = await prisma.propertyCategory.update({
      where: {
        property_category_code: property_category_code,
      },
      data: { deleted: true },
    });

    return res.status(200).json({
      status: ' delete success',
      message: 'propert category deleted successfull',
    });
  } catch (error) {
    console.error('Error fetching property category:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

// export const deletePropertyCategorybyPropertyCategoryCode = async (
//   req: Request,
//   res: Response,
// ) => {
//   try {
//     // Extract the property_category_code from request parameters
//     const { property_category_code } = req.params;

//     // Validate that property_category_code is provided
//     if (!property_category_code) {
//       return res.status(400).json({
//         status: 'error',
//         message: 'Property Category Code is required',
//       });
//     }

//     // Delete property category by property_category_code
//     await prisma.propertyCategory.delete({
//       where: {
//         property_category_code: property_category_code,
//       },
//     });

//     // Return success response
//     return res.status(200).json({
//       status: 'success',
//       message: 'Property category deleted successfully',
//     });
//   } catch (error) {
//     console.error('Error deleting property category:', error);
//     return res.status(500).json({
//       status: 'error',
//       message: 'Internal server error',
//     });
//   }
// };

export const searchCategoryProperty = async (req: Request, res: Response) => {
  try {
    const categoryQuery = req.query.category as string;

    console.log('Searching for category:', categoryQuery);

    // Jika tidak ada parameter category, kembalikan semua data
    if (!categoryQuery) {
      const allProperties = await prisma.propertyCategory.findMany();
      return res.status(200).json({
        status: 'success',
        data: allProperties,
      });
    }

    // Filter berdasarkan category
    const properties = await prisma.propertyCategory.findMany({
      where: {
        property_category_name: {
          equals: categoryQuery,
          mode: 'insensitive',
        },
      },
    });

    res.status(200).json({
      status: 'success',
      data: properties,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : JSON.stringify(error),
    });
  }
};
