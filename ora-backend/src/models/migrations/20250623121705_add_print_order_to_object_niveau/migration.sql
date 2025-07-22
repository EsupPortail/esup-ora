/*
  Warnings:

  - Added the required column `print_order` to the `niveau` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "niveau" ADD COLUMN     "print_order" INTEGER NOT NULL;
