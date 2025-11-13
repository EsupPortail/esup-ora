/*
  Warnings:

  - You are about to drop the `application_parameter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `information_bubble` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "formation" ADD COLUMN     "total_effectif_theorique" INTEGER;

-- DropTable
DROP TABLE "application_parameter";

-- DropTable
DROP TABLE "information_bubble";
