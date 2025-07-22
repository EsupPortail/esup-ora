/*
  Warnings:

  - You are about to drop the column `effectif_theorique` on the `formation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "formation" DROP COLUMN "effectif_theorique";

-- AlterTable
ALTER TABLE "parcours" ADD COLUMN     "effectif_theorique" INTEGER;
