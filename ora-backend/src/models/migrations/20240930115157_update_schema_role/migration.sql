/*
  Warnings:

  - Added the required column `code` to the `role` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "role" ADD COLUMN     "code" VARCHAR(255) NOT NULL;
