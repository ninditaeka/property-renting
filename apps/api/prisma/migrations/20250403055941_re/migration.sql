/*
  Warnings:

  - You are about to drop the column `number_of_room` on the `room_numbers` table. All the data in the column will be lost.
  - Added the required column `room_number` to the `room_numbers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "room_numbers" DROP COLUMN "number_of_room",
ADD COLUMN     "room_number" TEXT NOT NULL;
