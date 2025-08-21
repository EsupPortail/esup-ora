/*
  Warnings:

  - Added the required column `etablissementId` to the `Composante` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Composante" ADD COLUMN     "etablissementId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Etablissement" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,

    CONSTRAINT "Etablissement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parametre" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Parametre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParametreElement" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "value" VARCHAR(255) NOT NULL,
    "parametreId" INTEGER NOT NULL,

    CONSTRAINT "ParametreElement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FormationToParametre" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_EtablissementToParametre" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FormationToParametre_AB_unique" ON "_FormationToParametre"("A", "B");

-- CreateIndex
CREATE INDEX "_FormationToParametre_B_index" ON "_FormationToParametre"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EtablissementToParametre_AB_unique" ON "_EtablissementToParametre"("A", "B");

-- CreateIndex
CREATE INDEX "_EtablissementToParametre_B_index" ON "_EtablissementToParametre"("B");

-- AddForeignKey
ALTER TABLE "Composante" ADD CONSTRAINT "Composante_etablissementId_fkey" FOREIGN KEY ("etablissementId") REFERENCES "Etablissement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParametreElement" ADD CONSTRAINT "ParametreElement_parametreId_fkey" FOREIGN KEY ("parametreId") REFERENCES "Parametre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FormationToParametre" ADD CONSTRAINT "_FormationToParametre_A_fkey" FOREIGN KEY ("A") REFERENCES "Formation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FormationToParametre" ADD CONSTRAINT "_FormationToParametre_B_fkey" FOREIGN KEY ("B") REFERENCES "Parametre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EtablissementToParametre" ADD CONSTRAINT "_EtablissementToParametre_A_fkey" FOREIGN KEY ("A") REFERENCES "Etablissement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EtablissementToParametre" ADD CONSTRAINT "_EtablissementToParametre_B_fkey" FOREIGN KEY ("B") REFERENCES "Parametre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
