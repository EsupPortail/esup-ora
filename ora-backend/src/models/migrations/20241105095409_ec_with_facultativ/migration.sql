-- DropForeignKey
ALTER TABLE "element_constitutif" DROP CONSTRAINT "element_constitutif_competence_id_fkey";

-- AlterTable
ALTER TABLE "element_constitutif" ALTER COLUMN "competence_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "element_constitutif" ADD CONSTRAINT "element_constitutif_competence_id_fkey" FOREIGN KEY ("competence_id") REFERENCES "competence"("id") ON DELETE SET NULL ON UPDATE CASCADE;
