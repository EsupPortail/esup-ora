-- AlterTable
ALTER TABLE "bloc_de_competence" ADD COLUMN     "est_mutualisable" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "element_constitutif" ADD COLUMN     "est_mutualisable" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "importation" (
    "id" SERIAL NOT NULL,
    "bloc_de_competence_id" INTEGER NOT NULL,
    "element_constitutif_id" INTEGER NOT NULL,

    CONSTRAINT "importation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "importation" ADD CONSTRAINT "importation_bloc_de_competence_id_fkey" FOREIGN KEY ("bloc_de_competence_id") REFERENCES "bloc_de_competence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "importation" ADD CONSTRAINT "importation_element_constitutif_id_fkey" FOREIGN KEY ("element_constitutif_id") REFERENCES "element_constitutif"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
