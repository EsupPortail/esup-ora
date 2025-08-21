/*
  Warnings:

  - Added the required column `ensembleApprentissageCritiqueId` to the `Competence` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parcoursId` to the `Version` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Competence" ADD COLUMN     "ensembleApprentissageCritiqueId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Version" ADD COLUMN     "parcoursId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "EnsembleApprentissageCritique" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,

    CONSTRAINT "EnsembleApprentissageCritique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprentissageCritique" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "ensembleApprentissageCritiqueId" INTEGER NOT NULL,

    CONSTRAINT "ApprentissageCritique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Niveau" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "apprentissageCritiqueId" INTEGER NOT NULL,

    CONSTRAINT "Niveau_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sae" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "familleDeSituationId" INTEGER NOT NULL,

    CONSTRAINT "Sae_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ressource" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "competenceId" INTEGER NOT NULL,

    CONSTRAINT "Ressource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parcours" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "formationId" INTEGER NOT NULL,

    CONSTRAINT "Parcours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Formation" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "composanteId" INTEGER NOT NULL,

    CONSTRAINT "Formation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Composante" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,

    CONSTRAINT "Composante_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ressource_competenceId_key" ON "Ressource"("competenceId");

-- AddForeignKey
ALTER TABLE "Competence" ADD CONSTRAINT "Competence_ensembleApprentissageCritiqueId_fkey" FOREIGN KEY ("ensembleApprentissageCritiqueId") REFERENCES "EnsembleApprentissageCritique"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprentissageCritique" ADD CONSTRAINT "ApprentissageCritique_ensembleApprentissageCritiqueId_fkey" FOREIGN KEY ("ensembleApprentissageCritiqueId") REFERENCES "EnsembleApprentissageCritique"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Niveau" ADD CONSTRAINT "Niveau_apprentissageCritiqueId_fkey" FOREIGN KEY ("apprentissageCritiqueId") REFERENCES "ApprentissageCritique"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sae" ADD CONSTRAINT "Sae_familleDeSituationId_fkey" FOREIGN KEY ("familleDeSituationId") REFERENCES "FamilleDeSituation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ressource" ADD CONSTRAINT "Ressource_competenceId_fkey" FOREIGN KEY ("competenceId") REFERENCES "Competence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Version" ADD CONSTRAINT "Version_parcoursId_fkey" FOREIGN KEY ("parcoursId") REFERENCES "Parcours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parcours" ADD CONSTRAINT "Parcours_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "Formation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Formation" ADD CONSTRAINT "Formation_composanteId_fkey" FOREIGN KEY ("composanteId") REFERENCES "Composante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
