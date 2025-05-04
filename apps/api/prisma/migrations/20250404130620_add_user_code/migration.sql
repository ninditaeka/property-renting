/*
  Warnings:

  - A unique constraint covering the columns `[user_code]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - The required column `user_code` was added to the `users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "user_code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_user_code_key" ON "users"("user_code");
