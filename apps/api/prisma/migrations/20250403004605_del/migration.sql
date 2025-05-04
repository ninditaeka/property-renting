-- AlterTable
ALTER TABLE "property_having_facilities" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "room_numbers" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "room_type_having_facilities" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;
