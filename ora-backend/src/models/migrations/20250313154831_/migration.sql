/*
  Warnings:

  - Added the required column `formation_id` to the `niveau` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "niveau" ADD COLUMN     "formation_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "niveau" ADD CONSTRAINT "niveau_formation_id_fkey" FOREIGN KEY ("formation_id") REFERENCES "formation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
