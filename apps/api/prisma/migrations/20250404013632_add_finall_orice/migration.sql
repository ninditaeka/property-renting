/*
  Warnings:

  - Added the required column `finall_price` to the `property_price_histories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "property_price_histories" ADD COLUMN     "finall_price" INTEGER NOT NULL;
