/*
  Warnings:

  - You are about to drop the column `parcours_id` on the `version` table. All the data in the column will be lost.
  - Added the required column `formation_id` to the `version` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "version" DROP CONSTRAINT "version_parcours_id_fkey";

-- AlterTable
ALTER TABLE "version" DROP COLUMN "parcours_id",
ADD COLUMN     "formation_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "version" ADD CONSTRAINT "version_formation_id_fkey" FOREIGN KEY ("formation_id") REFERENCES "formation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
