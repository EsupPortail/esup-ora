-- AlterTable
ALTER TABLE "element_constitutif_mutualised_imported" ADD COLUMN     "unites_enseignement_id" INTEGER;

-- AddForeignKey
ALTER TABLE "element_constitutif_mutualised_imported" ADD CONSTRAINT "element_constitutif_mutualised_imported_unites_enseignemen_fkey" FOREIGN KEY ("unites_enseignement_id") REFERENCES "unites_enseignement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
