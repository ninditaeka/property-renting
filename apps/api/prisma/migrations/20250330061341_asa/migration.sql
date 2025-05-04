/*
  Warnings:

  - You are about to drop the column `room_numbers_id` on the `room_types` table. All the data in the column will be lost.
  - Added the required column `room_type_id` to the `room_numbers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "room_types" DROP CONSTRAINT "room_types_room_numbers_id_fkey";

-- AlterTable
ALTER TABLE "room_numbers" ADD COLUMN     "room_type_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "room_types" DROP COLUMN "room_numbers_id";

-- AddForeignKey
ALTER TABLE "room_numbers" ADD CONSTRAINT "room_numbers_room_type_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "room_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
