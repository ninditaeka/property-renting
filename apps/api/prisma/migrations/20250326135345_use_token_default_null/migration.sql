-- DropIndex
DROP INDEX "users_token_key";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "token" DROP NOT NULL;
