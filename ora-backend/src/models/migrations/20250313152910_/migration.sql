/*
  Warnings:

  - You are about to drop the column `effectif_theorique` on the `parcours` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "formation" ADD COLUMN     "effectif_theorique" INTEGER;

-- AlterTable
ALTER TABLE "parcours" DROP COLUMN "effectif_theorique";
