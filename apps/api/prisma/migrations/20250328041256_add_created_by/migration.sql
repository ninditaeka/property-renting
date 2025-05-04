/*
  Warnings:

  - Added the required column `created_by` to the `property_categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "property_categories" ADD COLUMN     "created_by" INTEGER NOT NULL;
