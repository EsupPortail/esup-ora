/*
  Warnings:

  - You are about to drop the column `render_order` on the `niveau` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "niveau" DROP COLUMN "render_order";

-- CreateTable
CREATE TABLE "_ImportationMutualisation" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ImportationMutualisation_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ImportationMutualisation_B_index" ON "_ImportationMutualisation"("B");

-- AddForeignKey
ALTER TABLE "_ImportationMutualisation" ADD CONSTRAINT "_ImportationMutualisation_A_fkey" FOREIGN KEY ("A") REFERENCES "bloc_de_competence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImportationMutualisation" ADD CONSTRAINT "_ImportationMutualisation_B_fkey" FOREIGN KEY ("B") REFERENCES "element_constitutif"("id") ON DELETE CASCADE ON UPDATE CASCADE;
