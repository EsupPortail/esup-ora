/*
  Warnings:

  - Added the required column `version_id` to the `element_constitutif` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "element_constitutif" ADD COLUMN     "version_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "element_constitutif" ADD CONSTRAINT "element_constitutif_version_id_fkey" FOREIGN KEY ("version_id") REFERENCES "version"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
