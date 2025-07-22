/*
  Warnings:

  - A unique constraint covering the columns `[blocDeCompetenceId]` on the table `Ressource` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `blocDeCompetenceId` to the `Competence` table without a default value. This is not possible if the table is not empty.
  - Added the required column `blocDeCompetenceId` to the `Contexte` table without a default value. This is not possible if the table is not empty.
  - Added the required column `blocDeCompetenceId` to the `Ressource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Competence" ADD COLUMN     "blocDeCompetenceId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Contexte" ADD COLUMN     "blocDeCompetenceId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Ressource" ADD COLUMN     "blocDeCompetenceId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "roleId" INTEGER;

-- CreateTable
CREATE TABLE "Evaluation" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "ressourceId" INTEGER NOT NULL,
    "typeEvaluationId" INTEGER NOT NULL,

    CONSTRAINT "Evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypeEvaluation" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,

    CONSTRAINT "TypeEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CritereExigence" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "competenceId" INTEGER NOT NULL,

    CONSTRAINT "CritereExigence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypeCritereExigence" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,

    CONSTRAINT "TypeCritereExigence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enseignement" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "ensembleApprentissageCritiqueId" INTEGER NOT NULL,
    "typeEnseignementId" INTEGER NOT NULL,

    CONSTRAINT "Enseignement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Semestre" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "enseignementId" INTEGER NOT NULL,

    CONSTRAINT "Semestre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypeEnseignement" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,

    CONSTRAINT "TypeEnseignement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Etiquette" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "critereExigenceId" INTEGER NOT NULL,

    CONSTRAINT "Etiquette_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlocDeCompetence" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,

    CONSTRAINT "BlocDeCompetence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RessourceToSae" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CritereExigenceToTypeCritereExigence" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Evaluation_ressourceId_key" ON "Evaluation"("ressourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_RessourceToSae_AB_unique" ON "_RessourceToSae"("A", "B");

-- CreateIndex
CREATE INDEX "_RessourceToSae_B_index" ON "_RessourceToSae"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CritereExigenceToTypeCritereExigence_AB_unique" ON "_CritereExigenceToTypeCritereExigence"("A", "B");

-- CreateIndex
CREATE INDEX "_CritereExigenceToTypeCritereExigence_B_index" ON "_CritereExigenceToTypeCritereExigence"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Ressource_blocDeCompetenceId_key" ON "Ressource"("blocDeCompetenceId");

-- AddForeignKey
ALTER TABLE "Competence" ADD CONSTRAINT "Competence_blocDeCompetenceId_fkey" FOREIGN KEY ("blocDeCompetenceId") REFERENCES "BlocDeCompetence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contexte" ADD CONSTRAINT "Contexte_blocDeCompetenceId_fkey" FOREIGN KEY ("blocDeCompetenceId") REFERENCES "BlocDeCompetence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ressource" ADD CONSTRAINT "Ressource_blocDeCompetenceId_fkey" FOREIGN KEY ("blocDeCompetenceId") REFERENCES "BlocDeCompetence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_ressourceId_fkey" FOREIGN KEY ("ressourceId") REFERENCES "Ressource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_typeEvaluationId_fkey" FOREIGN KEY ("typeEvaluationId") REFERENCES "TypeEvaluation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CritereExigence" ADD CONSTRAINT "CritereExigence_competenceId_fkey" FOREIGN KEY ("competenceId") REFERENCES "Competence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enseignement" ADD CONSTRAINT "Enseignement_ensembleApprentissageCritiqueId_fkey" FOREIGN KEY ("ensembleApprentissageCritiqueId") REFERENCES "EnsembleApprentissageCritique"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enseignement" ADD CONSTRAINT "Enseignement_typeEnseignementId_fkey" FOREIGN KEY ("typeEnseignementId") REFERENCES "TypeEnseignement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Semestre" ADD CONSTRAINT "Semestre_enseignementId_fkey" FOREIGN KEY ("enseignementId") REFERENCES "Enseignement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Etiquette" ADD CONSTRAINT "Etiquette_critereExigenceId_fkey" FOREIGN KEY ("critereExigenceId") REFERENCES "CritereExigence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RessourceToSae" ADD CONSTRAINT "_RessourceToSae_A_fkey" FOREIGN KEY ("A") REFERENCES "Ressource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RessourceToSae" ADD CONSTRAINT "_RessourceToSae_B_fkey" FOREIGN KEY ("B") REFERENCES "Sae"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CritereExigenceToTypeCritereExigence" ADD CONSTRAINT "_CritereExigenceToTypeCritereExigence_A_fkey" FOREIGN KEY ("A") REFERENCES "CritereExigence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CritereExigenceToTypeCritereExigence" ADD CONSTRAINT "_CritereExigenceToTypeCritereExigence_B_fkey" FOREIGN KEY ("B") REFERENCES "TypeCritereExigence"("id") ON DELETE CASCADE ON UPDATE CASCADE;
