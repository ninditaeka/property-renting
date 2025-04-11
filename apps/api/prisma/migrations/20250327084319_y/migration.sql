/*
  Warnings:

  - Added the required column `bank_name` to the `tenant_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tenant_details" ADD COLUMN     "bank_name" VARCHAR(50) NOT NULL;
