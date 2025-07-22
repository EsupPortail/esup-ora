/*
  Warnings:

  - You are about to drop the column `credits_ects` on the `stage` table. All the data in the column will be lost.
  - You are about to drop the column `volume_horaire_etudiant` on the `stage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "element_constitutif" ADD COLUMN     "credits_ects" INTEGER,
ADD COLUMN     "volume_horaire_etudiant" INTEGER;

-- AlterTable
ALTER TABLE "stage" DROP COLUMN "credits_ects",
DROP COLUMN "volume_horaire_etudiant";
