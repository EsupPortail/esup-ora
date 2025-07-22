/*
  Warnings:

  - Added the required column `version_id` to the `bloc_de_competence` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bloc_de_competence" ADD COLUMN     "version_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "bloc_de_competence" ADD CONSTRAINT "bloc_de_competence_version_id_fkey" FOREIGN KEY ("version_id") REFERENCES "version"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
