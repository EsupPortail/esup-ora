-- AlterTable
ALTER TABLE "bloc_de_competence" ADD COLUMN     "parcours_id" INTEGER;

-- AddForeignKey
ALTER TABLE "bloc_de_competence" ADD CONSTRAINT "bloc_de_competence_parcours_id_fkey" FOREIGN KEY ("parcours_id") REFERENCES "parcours"("id") ON DELETE SET NULL ON UPDATE CASCADE;
