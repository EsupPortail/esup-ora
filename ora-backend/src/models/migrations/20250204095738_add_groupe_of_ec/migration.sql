-- AlterTable
ALTER TABLE "element_constitutif" ADD COLUMN     "groupe_ec_id" INTEGER,
ALTER COLUMN "est_mutualisable" DROP NOT NULL;

-- AlterTable
ALTER TABLE "parametre" ADD COLUMN     "semantique_apprentissage" VARCHAR(100),
ADD COLUMN     "semantique_bcc" VARCHAR(100),
ADD COLUMN     "semantique_competence" VARCHAR(100),
ADD COLUMN     "semantique_critere" VARCHAR(100),
ADD COLUMN     "semantique_famille" VARCHAR(100),
ADD COLUMN     "semantique_ue" VARCHAR(100);

-- CreateTable
CREATE TABLE "groupe_ec" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "bloc_de_competence_id" INTEGER NOT NULL,

    CONSTRAINT "groupe_ec_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "element_constitutif" ADD CONSTRAINT "element_constitutif_groupe_ec_id_fkey" FOREIGN KEY ("groupe_ec_id") REFERENCES "groupe_ec"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupe_ec" ADD CONSTRAINT "groupe_ec_bloc_de_competence_id_fkey" FOREIGN KEY ("bloc_de_competence_id") REFERENCES "bloc_de_competence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
