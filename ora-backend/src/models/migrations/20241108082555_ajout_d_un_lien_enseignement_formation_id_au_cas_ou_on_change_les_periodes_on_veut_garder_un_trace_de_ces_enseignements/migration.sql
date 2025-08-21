/*
  Warnings:

  - Added the required column `formation_id` to the `enseignement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "enseignement" ADD COLUMN     "formation_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "enseignement" ADD CONSTRAINT "enseignement_formation_id_fkey" FOREIGN KEY ("formation_id") REFERENCES "formation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
