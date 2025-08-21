/*
  Warnings:

  - You are about to drop the column `ressourceId` on the `Evaluation` table. All the data in the column will be lost.
  - You are about to drop the `Contexte` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ressource` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ContexteToFamilleDeSituation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RessourceToSae` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[elementConstitutifId]` on the table `Evaluation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `elementConstitutifId` to the `Evaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `competenceId` to the `FamilleDeSituation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Contexte" DROP CONSTRAINT "Contexte_blocDeCompetenceId_fkey";

-- DropForeignKey
ALTER TABLE "Contexte" DROP CONSTRAINT "Contexte_competenceId_fkey";

-- DropForeignKey
ALTER TABLE "Evaluation" DROP CONSTRAINT "Evaluation_ressourceId_fkey";

-- DropForeignKey
ALTER TABLE "Ressource" DROP CONSTRAINT "Ressource_blocDeCompetenceId_fkey";

-- DropForeignKey
ALTER TABLE "Ressource" DROP CONSTRAINT "Ressource_competenceId_fkey";

-- DropForeignKey
ALTER TABLE "_ContexteToFamilleDeSituation" DROP CONSTRAINT "_ContexteToFamilleDeSituation_A_fkey";

-- DropForeignKey
ALTER TABLE "_ContexteToFamilleDeSituation" DROP CONSTRAINT "_ContexteToFamilleDeSituation_B_fkey";

-- DropForeignKey
ALTER TABLE "_RessourceToSae" DROP CONSTRAINT "_RessourceToSae_A_fkey";

-- DropForeignKey
ALTER TABLE "_RessourceToSae" DROP CONSTRAINT "_RessourceToSae_B_fkey";

-- DropIndex
DROP INDEX "Evaluation_ressourceId_key";

-- AlterTable
ALTER TABLE "Evaluation" DROP COLUMN "ressourceId",
ADD COLUMN     "elementConstitutifId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "FamilleDeSituation" ADD COLUMN     "competenceId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Contexte";

-- DropTable
DROP TABLE "Ressource";

-- DropTable
DROP TABLE "_ContexteToFamilleDeSituation";

-- DropTable
DROP TABLE "_RessourceToSae";

-- CreateTable
CREATE TABLE "ElementConstitutif" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "competenceId" INTEGER NOT NULL,
    "blocDeCompetenceId" INTEGER NOT NULL,

    CONSTRAINT "ElementConstitutif_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ApprentissageCritiqueToBlocDeCompetence" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ElementConstitutifToSae" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ElementConstitutifToEnseignement" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ElementConstitutif_competenceId_key" ON "ElementConstitutif"("competenceId");

-- CreateIndex
CREATE UNIQUE INDEX "ElementConstitutif_blocDeCompetenceId_key" ON "ElementConstitutif"("blocDeCompetenceId");

-- CreateIndex
CREATE UNIQUE INDEX "_ApprentissageCritiqueToBlocDeCompetence_AB_unique" ON "_ApprentissageCritiqueToBlocDeCompetence"("A", "B");

-- CreateIndex
CREATE INDEX "_ApprentissageCritiqueToBlocDeCompetence_B_index" ON "_ApprentissageCritiqueToBlocDeCompetence"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ElementConstitutifToSae_AB_unique" ON "_ElementConstitutifToSae"("A", "B");

-- CreateIndex
CREATE INDEX "_ElementConstitutifToSae_B_index" ON "_ElementConstitutifToSae"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ElementConstitutifToEnseignement_AB_unique" ON "_ElementConstitutifToEnseignement"("A", "B");

-- CreateIndex
CREATE INDEX "_ElementConstitutifToEnseignement_B_index" ON "_ElementConstitutifToEnseignement"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Evaluation_elementConstitutifId_key" ON "Evaluation"("elementConstitutifId");

-- AddForeignKey
ALTER TABLE "FamilleDeSituation" ADD CONSTRAINT "FamilleDeSituation_competenceId_fkey" FOREIGN KEY ("competenceId") REFERENCES "Competence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElementConstitutif" ADD CONSTRAINT "ElementConstitutif_competenceId_fkey" FOREIGN KEY ("competenceId") REFERENCES "Competence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElementConstitutif" ADD CONSTRAINT "ElementConstitutif_blocDeCompetenceId_fkey" FOREIGN KEY ("blocDeCompetenceId") REFERENCES "BlocDeCompetence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_elementConstitutifId_fkey" FOREIGN KEY ("elementConstitutifId") REFERENCES "ElementConstitutif"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApprentissageCritiqueToBlocDeCompetence" ADD CONSTRAINT "_ApprentissageCritiqueToBlocDeCompetence_A_fkey" FOREIGN KEY ("A") REFERENCES "ApprentissageCritique"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApprentissageCritiqueToBlocDeCompetence" ADD CONSTRAINT "_ApprentissageCritiqueToBlocDeCompetence_B_fkey" FOREIGN KEY ("B") REFERENCES "BlocDeCompetence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ElementConstitutifToSae" ADD CONSTRAINT "_ElementConstitutifToSae_A_fkey" FOREIGN KEY ("A") REFERENCES "ElementConstitutif"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ElementConstitutifToSae" ADD CONSTRAINT "_ElementConstitutifToSae_B_fkey" FOREIGN KEY ("B") REFERENCES "Sae"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ElementConstitutifToEnseignement" ADD CONSTRAINT "_ElementConstitutifToEnseignement_A_fkey" FOREIGN KEY ("A") REFERENCES "ElementConstitutif"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ElementConstitutifToEnseignement" ADD CONSTRAINT "_ElementConstitutifToEnseignement_B_fkey" FOREIGN KEY ("B") REFERENCES "Enseignement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
