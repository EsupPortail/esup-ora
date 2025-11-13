-- AlterTable
ALTER TABLE "element_constitutif" ADD COLUMN     "unites_enseignement_id" INTEGER;

-- CreateTable
CREATE TABLE "unites_enseignement" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "periode_id" INTEGER,

    CONSTRAINT "unites_enseignement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "element_constitutif" ADD CONSTRAINT "element_constitutif_unites_enseignement_id_fkey" FOREIGN KEY ("unites_enseignement_id") REFERENCES "unites_enseignement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unites_enseignement" ADD CONSTRAINT "unites_enseignement_periode_id_fkey" FOREIGN KEY ("periode_id") REFERENCES "periodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
