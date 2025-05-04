/*
  Warnings:

  - A unique constraint covering the columns `[facebook_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "facebook_id" TEXT,
ADD COLUMN     "photo" TEXT,
ADD COLUMN     "profile_picture" TEXT,
ADD COLUMN     "role" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_facebook_id_key" ON "users"("facebook_id");
