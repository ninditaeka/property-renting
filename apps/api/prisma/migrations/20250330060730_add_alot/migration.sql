/*
  Warnings:

  - You are about to drop the `property_having_facility` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `room_type_having_facility` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[property_code]` on the table `properties` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[property_price_history_code]` on the table `property_price_histories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[room_type_code]` on the table `room_types` will be added. If there are existing duplicate values, this will fail.
  - The required column `property_code` was added to the `properties` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `property_price_history_code` was added to the `property_price_histories` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `room_numbers_id` to the `property_price_histories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `room_numbers_id` to the `room_types` table without a default value. This is not possible if the table is not empty.
  - The required column `room_type_code` was added to the `room_types` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "property_having_facility" DROP CONSTRAINT "property_having_facility_property_facility_id_fkey";

-- DropForeignKey
ALTER TABLE "property_having_facility" DROP CONSTRAINT "property_having_facility_property_id_fkey";

-- DropForeignKey
ALTER TABLE "room_type_having_facility" DROP CONSTRAINT "room_type_having_facility_room_facility_id_fkey";

-- DropForeignKey
ALTER TABLE "room_type_having_facility" DROP CONSTRAINT "room_type_having_facility_room_type_id_fkey";

-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "property_code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "property_price_histories" ADD COLUMN     "property_price_history_code" TEXT NOT NULL,
ADD COLUMN     "room_numbers_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "room_types" ADD COLUMN     "room_numbers_id" INTEGER NOT NULL,
ADD COLUMN     "room_type_code" TEXT NOT NULL;

-- DropTable
DROP TABLE "property_having_facility";

-- DropTable
DROP TABLE "room_type_having_facility";

-- CreateTable
CREATE TABLE "property_having_facilities" (
    "id" SERIAL NOT NULL,
    "property_id" INTEGER NOT NULL,
    "property_facility_id" INTEGER NOT NULL,

    CONSTRAINT "property_having_facilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_type_having_facilities" (
    "id" SERIAL NOT NULL,
    "room_facility_id" INTEGER NOT NULL,
    "room_type_id" INTEGER NOT NULL,

    CONSTRAINT "room_type_having_facilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_numbers" (
    "id" SERIAL NOT NULL,
    "number_of_room" TEXT NOT NULL,

    CONSTRAINT "room_numbers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "properties_property_code_key" ON "properties"("property_code");

-- CreateIndex
CREATE UNIQUE INDEX "property_price_histories_property_price_history_code_key" ON "property_price_histories"("property_price_history_code");

-- CreateIndex
CREATE UNIQUE INDEX "room_types_room_type_code_key" ON "room_types"("room_type_code");

-- AddForeignKey
ALTER TABLE "property_price_histories" ADD CONSTRAINT "property_price_histories_room_numbers_id_fkey" FOREIGN KEY ("room_numbers_id") REFERENCES "room_numbers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_types" ADD CONSTRAINT "room_types_room_numbers_id_fkey" FOREIGN KEY ("room_numbers_id") REFERENCES "room_numbers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_having_facilities" ADD CONSTRAINT "property_having_facilities_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_having_facilities" ADD CONSTRAINT "property_having_facilities_property_facility_id_fkey" FOREIGN KEY ("property_facility_id") REFERENCES "property_facilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_type_having_facilities" ADD CONSTRAINT "room_type_having_facilities_room_facility_id_fkey" FOREIGN KEY ("room_facility_id") REFERENCES "room_facilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_type_having_facilities" ADD CONSTRAINT "room_type_having_facilities_room_type_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "room_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
