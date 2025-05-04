/*
  Warnings:

  - Added the required column `province` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "province" VARCHAR(50) NOT NULL;
