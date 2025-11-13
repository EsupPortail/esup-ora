/*
  Warnings:

  - A unique constraint covering the columns `[enseignement_id]` on the table `element_constitutif` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "element_constitutif_enseignement_id_key" ON "element_constitutif"("enseignement_id");
