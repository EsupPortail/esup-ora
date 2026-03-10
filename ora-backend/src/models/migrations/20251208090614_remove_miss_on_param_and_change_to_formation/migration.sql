/*
  Warnings:

  - You are about to drop the column `utilisateurs_rattaches` on the `parametre` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "formation" ADD COLUMN     "utilisateurs_rattaches" VARCHAR(255)[];

-- AlterTable
ALTER TABLE "parametre" DROP COLUMN "utilisateurs_rattaches";
