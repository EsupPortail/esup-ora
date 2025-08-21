/*
  Warnings:

  - You are about to drop the column `version_id` on the `niveau` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "niveau" DROP CONSTRAINT "niveau_version_id_fkey";

-- AlterTable
ALTER TABLE "enseignement" ADD COLUMN     "nombre_de_niveaux" INTEGER;

-- AlterTable
ALTER TABLE "niveau" DROP COLUMN "version_id";
