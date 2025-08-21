/*
  Warnings:

  - You are about to drop the column `type_formation_id` on the `formation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "formation" DROP CONSTRAINT "formation_type_formation_id_fkey";

-- AlterTable
ALTER TABLE "formation" DROP COLUMN "type_formation_id";
