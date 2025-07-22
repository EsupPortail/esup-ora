/*
  Warnings:

  - You are about to drop the column `volume_horaire_etudiant` on the `element_constitutif` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "element_constitutif" DROP COLUMN "volume_horaire_etudiant";

-- CreateTable
CREATE TABLE "stage" (
    "id" SERIAL NOT NULL,
    "volume_horaire_etudiant" INTEGER,
    "credits_ects" INTEGER,

    CONSTRAINT "stage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_element_constitutifTostage" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_element_constitutifTostage_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_element_constitutifTostage_B_index" ON "_element_constitutifTostage"("B");

-- AddForeignKey
ALTER TABLE "_element_constitutifTostage" ADD CONSTRAINT "_element_constitutifTostage_A_fkey" FOREIGN KEY ("A") REFERENCES "element_constitutif"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_element_constitutifTostage" ADD CONSTRAINT "_element_constitutifTostage_B_fkey" FOREIGN KEY ("B") REFERENCES "stage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
