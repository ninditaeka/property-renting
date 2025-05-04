/*
  Warnings:

  - You are about to drop the column `user_id` on the `properties` table. All the data in the column will be lost.
  - Added the required column `created_by` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_user_id_fkey";

-- AlterTable
ALTER TABLE "properties" DROP COLUMN "user_id",
ADD COLUMN     "created_by" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
