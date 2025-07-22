/*
  Warnings:

  - You are about to drop the column `nombre_de_niveaux` on the `enseignement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "enseignement" DROP COLUMN "nombre_de_niveaux";

-- AlterTable
ALTER TABLE "formation" ADD COLUMN     "nombre_de_niveaux" INTEGER;
