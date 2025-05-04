/*
  Warnings:

  - A unique constraint covering the columns `[property_category_code]` on the table `property_categories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "property_categories_property_category_code_key" ON "property_categories"("property_category_code");
