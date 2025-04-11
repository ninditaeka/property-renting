/*
  Warnings:

  - The required column `property_code` was added to the `property_categories` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "property_categories" ADD COLUMN     "property_code" TEXT NOT NULL;
