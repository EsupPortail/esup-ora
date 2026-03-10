/*
  Warnings:

  - Added the required column `numero_fiche` to the `rncp_bcc` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rncp_bcc" ADD COLUMN     "numero_fiche" VARCHAR(255) NOT NULL;
