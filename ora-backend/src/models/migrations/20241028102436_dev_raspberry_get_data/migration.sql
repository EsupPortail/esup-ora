/*
  Warnings:

  - You are about to drop the `parametre_element` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `diplome_id` to the `formation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type_formation_id` to the `formation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "parametre_element" DROP CONSTRAINT "parametre_element_parametre_id_fkey";

-- DropForeignKey
ALTER TABLE "version" DROP CONSTRAINT "version_competence_id_fkey";

-- AlterTable
ALTER TABLE "composante" ADD COLUMN     "parametre_id" INTEGER;

-- AlterTable
ALTER TABLE "formation" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "diplome_id" INTEGER NOT NULL,
ADD COLUMN     "duree" INTEGER,
ADD COLUMN     "duree_unite" VARCHAR(255),
ADD COLUMN     "nb_credits" INTEGER,
ADD COLUMN     "nb_heures_enseignement" INTEGER,
ADD COLUMN     "type_formation_id" INTEGER NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3),
ADD COLUMN     "updated_by" TEXT;

-- AlterTable
ALTER TABLE "parametre" ADD COLUMN     "duree_formation" INTEGER,
ADD COLUMN     "duree_formation_unite" VARCHAR(255),
ADD COLUMN     "nb_credits" INTEGER,
ADD COLUMN     "nb_heures_enseignement" INTEGER,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "parcours" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "version" ALTER COLUMN "competence_id" DROP NOT NULL;

-- DropTable
DROP TABLE "parametre_element";

-- CreateTable
CREATE TABLE "diplome" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,

    CONSTRAINT "diplome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "type_formation" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,

    CONSTRAINT "type_formation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "version" ADD CONSTRAINT "version_competence_id_fkey" FOREIGN KEY ("competence_id") REFERENCES "competence"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formation" ADD CONSTRAINT "formation_diplome_id_fkey" FOREIGN KEY ("diplome_id") REFERENCES "diplome"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formation" ADD CONSTRAINT "formation_type_formation_id_fkey" FOREIGN KEY ("type_formation_id") REFERENCES "type_formation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "composante" ADD CONSTRAINT "composante_parametre_id_fkey" FOREIGN KEY ("parametre_id") REFERENCES "parametre"("id") ON DELETE SET NULL ON UPDATE CASCADE;
