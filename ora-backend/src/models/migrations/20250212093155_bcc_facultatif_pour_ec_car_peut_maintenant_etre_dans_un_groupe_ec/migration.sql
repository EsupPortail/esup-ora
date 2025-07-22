-- DropForeignKey
ALTER TABLE "element_constitutif" DROP CONSTRAINT "element_constitutif_bloc_de_competence_id_fkey";

-- AlterTable
ALTER TABLE "element_constitutif" ALTER COLUMN "bloc_de_competence_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "element_constitutif" ADD CONSTRAINT "element_constitutif_bloc_de_competence_id_fkey" FOREIGN KEY ("bloc_de_competence_id") REFERENCES "bloc_de_competence"("id") ON DELETE SET NULL ON UPDATE CASCADE;
