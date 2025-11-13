-- AlterTable
ALTER TABLE "element_constitutif" ADD COLUMN     "ens_options_connected_id" INTEGER;

-- AddForeignKey
ALTER TABLE "element_constitutif" ADD CONSTRAINT "element_constitutif_ens_options_connected_id_fkey" FOREIGN KEY ("ens_options_connected_id") REFERENCES "element_constitutif"("id") ON DELETE SET NULL ON UPDATE CASCADE;
