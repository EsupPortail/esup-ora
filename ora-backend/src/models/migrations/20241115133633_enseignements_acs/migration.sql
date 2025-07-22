/*
  Warnings:

  - You are about to drop the column `competence_id` on the `enseignement` table. All the data in the column will be lost.
  - Added the required column `element_constitutif_id` to the `tags` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "element_constitutif" DROP CONSTRAINT "element_constitutif_version_id_fkey";

-- DropForeignKey
ALTER TABLE "enseignement" DROP CONSTRAINT "enseignement_competence_id_fkey";

-- AlterTable
ALTER TABLE "bloc_de_competence" ADD COLUMN     "competence_id" INTEGER,
ADD COLUMN     "credits" INTEGER,
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "element_constitutif" ADD COLUMN     "commentaire" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "est_ouvert_etudiants_internationaux" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "nb_etudiant_max" INTEGER,
ADD COLUMN     "nb_etudiant_min" INTEGER,
ADD COLUMN     "obligatoire" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "presentiel" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "travail_personnel" INTEGER,
ADD COLUMN     "type" VARCHAR(255) NOT NULL DEFAULT 'Enseignement',
ADD COLUMN     "volume_horaire_cm" INTEGER,
ADD COLUMN     "volume_horaire_pt" INTEGER,
ADD COLUMN     "volume_horaire_td" INTEGER,
ADD COLUMN     "volume_horaire_tp" INTEGER,
ALTER COLUMN "version_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "enseignement" DROP COLUMN "competence_id";

-- AlterTable
ALTER TABLE "tags" ADD COLUMN     "element_constitutif_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "_apprentissage_critiqueToenseignement" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_apprentissage_critiqueToenseignement_AB_unique" ON "_apprentissage_critiqueToenseignement"("A", "B");

-- CreateIndex
CREATE INDEX "_apprentissage_critiqueToenseignement_B_index" ON "_apprentissage_critiqueToenseignement"("B");

-- AddForeignKey
ALTER TABLE "element_constitutif" ADD CONSTRAINT "element_constitutif_version_id_fkey" FOREIGN KEY ("version_id") REFERENCES "version"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_element_constitutif_id_fkey" FOREIGN KEY ("element_constitutif_id") REFERENCES "element_constitutif"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bloc_de_competence" ADD CONSTRAINT "bloc_de_competence_competence_id_fkey" FOREIGN KEY ("competence_id") REFERENCES "competence"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_apprentissage_critiqueToenseignement" ADD CONSTRAINT "_apprentissage_critiqueToenseignement_A_fkey" FOREIGN KEY ("A") REFERENCES "apprentissage_critique"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_apprentissage_critiqueToenseignement" ADD CONSTRAINT "_apprentissage_critiqueToenseignement_B_fkey" FOREIGN KEY ("B") REFERENCES "enseignement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
