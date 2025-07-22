/*
  Warnings:

  - You are about to drop the column `formation_id` on the `niveau` table. All the data in the column will be lost.
  - Added the required column `version_id` to the `niveau` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "niveau" DROP CONSTRAINT "niveau_formation_id_fkey";

-- AlterTable
ALTER TABLE "niveau" DROP COLUMN "formation_id",
ADD COLUMN     "version_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "niveau" ADD CONSTRAINT "niveau_version_id_fkey" FOREIGN KEY ("version_id") REFERENCES "version"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
