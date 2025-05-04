/*
  Warnings:

  - You are about to drop the column `property_code` on the `property_categories` table. All the data in the column will be lost.
  - The required column `property_category_code` was added to the `property_categories` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "property_categories" DROP COLUMN "property_code",
ADD COLUMN     "property_category_code" TEXT NOT NULL;
