-- AlterTable
ALTER TABLE "enseignement" ADD COLUMN     "competence_id" INTEGER;

-- AddForeignKey
ALTER TABLE "enseignement" ADD CONSTRAINT "enseignement_competence_id_fkey" FOREIGN KEY ("competence_id") REFERENCES "competence"("id") ON DELETE SET NULL ON UPDATE CASCADE;
