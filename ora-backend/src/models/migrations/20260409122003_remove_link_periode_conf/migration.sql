/*
  Warnings:

  - You are about to drop the column `periode_id` on the `periode_of_parcours_informations` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "periode_of_parcours_informations" DROP CONSTRAINT "periode_of_parcours_informations_periode_id_fkey";

-- AlterTable
ALTER TABLE "periode_of_parcours_informations" DROP COLUMN "periode_id",
ADD COLUMN     "periode_index" INTEGER;
