/*
  Warnings:

  - You are about to drop the column `competence_id` on the `version` table. All the data in the column will be lost.
  - Added the required column `version_id` to the `competence` table without a default value. This is not possible if the table is not empty.
  - Added the required column `element_constitutif_id` to the `enseignement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "version" DROP CONSTRAINT "version_competence_id_fkey";

-- AlterTable
ALTER TABLE "competence" ADD COLUMN     "version_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "enseignement" ADD COLUMN     "element_constitutif_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "version" DROP COLUMN "competence_id",
ADD COLUMN     "rncp" VARCHAR(255),
ADD COLUMN     "rome4" VARCHAR(255);

-- CreateTable
CREATE TABLE "competence_contextualisee" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "competence_id" INTEGER NOT NULL,

    CONSTRAINT "competence_contextualisee_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "competence" ADD CONSTRAINT "competence_version_id_fkey" FOREIGN KEY ("version_id") REFERENCES "version"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competence_contextualisee" ADD CONSTRAINT "competence_contextualisee_competence_id_fkey" FOREIGN KEY ("competence_id") REFERENCES "competence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
