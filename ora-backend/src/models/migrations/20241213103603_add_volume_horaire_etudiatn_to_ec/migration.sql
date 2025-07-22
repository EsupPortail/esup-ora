/*
  Warnings:

  - You are about to drop the column `parcours_id` on the `bloc_de_competence` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "bloc_de_competence" DROP CONSTRAINT "bloc_de_competence_parcours_id_fkey";

-- DropForeignKey
ALTER TABLE "formation" DROP CONSTRAINT "formation_type_formation_id_fkey";

-- AlterTable
ALTER TABLE "bloc_de_competence" DROP COLUMN "parcours_id";

-- AlterTable
ALTER TABLE "element_constitutif" ADD COLUMN     "volume_horaire_etudiant" INTEGER;

-- AlterTable
ALTER TABLE "formation" ALTER COLUMN "type_formation_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "_bloc_de_competenceToparcours" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_bloc_de_competenceToparcours_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_bloc_de_competenceToparcours_B_index" ON "_bloc_de_competenceToparcours"("B");

-- AddForeignKey
ALTER TABLE "formation" ADD CONSTRAINT "formation_type_formation_id_fkey" FOREIGN KEY ("type_formation_id") REFERENCES "type_formation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_bloc_de_competenceToparcours" ADD CONSTRAINT "_bloc_de_competenceToparcours_A_fkey" FOREIGN KEY ("A") REFERENCES "bloc_de_competence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_bloc_de_competenceToparcours" ADD CONSTRAINT "_bloc_de_competenceToparcours_B_fkey" FOREIGN KEY ("B") REFERENCES "parcours"("id") ON DELETE CASCADE ON UPDATE CASCADE;
