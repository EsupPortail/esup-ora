/*
  Warnings:

  - Added the required column `code` to the `rncp_bcc` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rncp_bcc" ADD COLUMN     "code" VARCHAR(255) NOT NULL;
