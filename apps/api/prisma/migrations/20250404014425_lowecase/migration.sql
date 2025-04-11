/*
  Warnings:

  - You are about to drop the column `Discount_amount` on the `property_price_histories` table. All the data in the column will be lost.
  - You are about to drop the column `Discount_type` on the `property_price_histories` table. All the data in the column will be lost.
  - Added the required column `discount_amount` to the `property_price_histories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discount_type` to the `property_price_histories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "property_price_histories" DROP COLUMN "Discount_amount",
DROP COLUMN "Discount_type",
ADD COLUMN     "discount_amount" INTEGER NOT NULL,
ADD COLUMN     "discount_type" TEXT NOT NULL;
