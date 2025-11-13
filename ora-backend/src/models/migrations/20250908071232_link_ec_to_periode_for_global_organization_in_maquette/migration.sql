-- AlterTable
ALTER TABLE "element_constitutif" ADD COLUMN     "periode_id" INTEGER;

-- AddForeignKey
ALTER TABLE "element_constitutif" ADD CONSTRAINT "element_constitutif_periode_id_fkey" FOREIGN KEY ("periode_id") REFERENCES "periodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
