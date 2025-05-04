/*
  Warnings:

  - Added the required column `room_number_booking` to the `property_bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "property_bookings" ADD COLUMN     "room_number_booking" INTEGER NOT NULL;
