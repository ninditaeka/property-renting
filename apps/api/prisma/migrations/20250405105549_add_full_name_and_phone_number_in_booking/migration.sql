/*
  Warnings:

  - Added the required column `full_name` to the `property_bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `property_bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "property_bookings" ADD COLUMN     "full_name" TEXT NOT NULL,
ADD COLUMN     "phone_number" TEXT NOT NULL;
