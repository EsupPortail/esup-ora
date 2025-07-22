-- DropForeignKey
ALTER TABLE "Competence" DROP CONSTRAINT "Competence_blocDeCompetenceId_fkey";

-- DropForeignKey
ALTER TABLE "Competence" DROP CONSTRAINT "Competence_ensembleApprentissageCritiqueId_fkey";

-- DropForeignKey
ALTER TABLE "Competence" DROP CONSTRAINT "Competence_rncpId_fkey";

-- DropForeignKey
ALTER TABLE "Competence" DROP CONSTRAINT "Competence_rome4Id_fkey";

-- AlterTable
ALTER TABLE "Competence" ALTER COLUMN "rncpId" DROP NOT NULL,
ALTER COLUMN "rome4Id" DROP NOT NULL,
ALTER COLUMN "ensembleApprentissageCritiqueId" DROP NOT NULL,
ALTER COLUMN "blocDeCompetenceId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Competence" ADD CONSTRAINT "Competence_rncpId_fkey" FOREIGN KEY ("rncpId") REFERENCES "Rncp"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competence" ADD CONSTRAINT "Competence_rome4Id_fkey" FOREIGN KEY ("rome4Id") REFERENCES "Rome4"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competence" ADD CONSTRAINT "Competence_ensembleApprentissageCritiqueId_fkey" FOREIGN KEY ("ensembleApprentissageCritiqueId") REFERENCES "EnsembleApprentissageCritique"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competence" ADD CONSTRAINT "Competence_blocDeCompetenceId_fkey" FOREIGN KEY ("blocDeCompetenceId") REFERENCES "BlocDeCompetence"("id") ON DELETE SET NULL ON UPDATE CASCADE;
