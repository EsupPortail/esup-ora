/*
  Warnings:

  - You are about to drop the column `blocDeCompetenceId` on the `Competence` table. All the data in the column will be lost.
  - You are about to drop the column `ensembleApprentissageCritiqueId` on the `Competence` table. All the data in the column will be lost.
  - You are about to drop the column `ensembleApprentissageCritiqueId` on the `Enseignement` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Competence" DROP CONSTRAINT "Competence_blocDeCompetenceId_fkey";

-- DropForeignKey
ALTER TABLE "Competence" DROP CONSTRAINT "Competence_ensembleApprentissageCritiqueId_fkey";

-- DropForeignKey
ALTER TABLE "Enseignement" DROP CONSTRAINT "Enseignement_ensembleApprentissageCritiqueId_fkey";

-- AlterTable
ALTER TABLE "Competence" DROP COLUMN "blocDeCompetenceId",
DROP COLUMN "ensembleApprentissageCritiqueId";

-- AlterTable
ALTER TABLE "Enseignement" DROP COLUMN "ensembleApprentissageCritiqueId";
