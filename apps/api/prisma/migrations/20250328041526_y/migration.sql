-- AlterTable
ALTER TABLE "property_categories" ALTER COLUMN "property_category_name" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "created_by" DROP NOT NULL;
