/*
  Warnings:

  - You are about to drop the column `element_constitutif_id` on the `enseignement` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "enseignement" DROP CONSTRAINT "enseignement_element_constitutif_id_fkey";

-- AlterTable
ALTER TABLE "enseignement" DROP COLUMN "element_constitutif_id";
