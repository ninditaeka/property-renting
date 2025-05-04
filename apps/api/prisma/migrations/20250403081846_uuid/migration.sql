/*
  Warnings:

  - A unique constraint covering the columns `[room_number_code]` on the table `room_numbers` will be added. If there are existing duplicate values, this will fail.
  - The required column `room_number_code` was added to the `room_numbers` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "room_numbers" ADD COLUMN     "room_number_code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "room_numbers_room_number_code_key" ON "room_numbers"("room_number_code");
