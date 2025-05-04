/*
  Warnings:

  - Added the required column `Discount_amount` to the `property_price_histories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Discount_type` to the `property_price_histories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_of_sale` to the `property_price_histories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "property_price_histories" ADD COLUMN     "Discount_amount" INTEGER NOT NULL,
ADD COLUMN     "Discount_type" TEXT NOT NULL,
ADD COLUMN     "name_of_sale" TEXT NOT NULL;
