/*
  Warnings:

  - You are about to drop the column `duree` on the `formation` table. All the data in the column will be lost.
  - You are about to drop the column `duree_unite` on the `formation` table. All the data in the column will be lost.
  - You are about to drop the column `nb_credits` on the `formation` table. All the data in the column will be lost.
  - You are about to drop the column `nb_heures_enseignement` on the `formation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "formation" DROP COLUMN "duree",
DROP COLUMN "duree_unite",
DROP COLUMN "nb_credits",
DROP COLUMN "nb_heures_enseignement";

-- AlterTable
ALTER TABLE "parcours" ADD COLUMN     "duree" INTEGER,
ADD COLUMN     "duree_unite" VARCHAR(255),
ADD COLUMN     "nb_credits" INTEGER,
ADD COLUMN     "nb_heures_enseignement" INTEGER;
