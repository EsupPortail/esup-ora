/*
  Warnings:

  - Added the required column `description` to the `Parcours` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Parcours" ADD COLUMN     "description" TEXT NOT NULL;
