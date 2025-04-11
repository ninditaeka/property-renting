/*
  Warnings:

  - You are about to drop the column `property_id` on the `property_categories` table. All the data in the column will be lost.
  - Added the required column `property_category_id` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "property_categories" DROP CONSTRAINT "property_categories_property_id_fkey";

-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "property_category_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "property_categories" DROP COLUMN "property_id";

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_property_category_id_fkey" FOREIGN KEY ("property_category_id") REFERENCES "property_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
