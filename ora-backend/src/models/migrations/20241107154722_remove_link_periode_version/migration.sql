/*
  Warnings:

  - You are about to drop the column `version_id` on the `enseignement` table. All the data in the column will be lost.
  - You are about to drop the `_enseignementToperiodes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_enseignementToperiodes" DROP CONSTRAINT "_enseignementToperiodes_A_fkey";

-- DropForeignKey
ALTER TABLE "_enseignementToperiodes" DROP CONSTRAINT "_enseignementToperiodes_B_fkey";

-- DropForeignKey
ALTER TABLE "enseignement" DROP CONSTRAINT "enseignement_version_id_fkey";

-- AlterTable
ALTER TABLE "enseignement" DROP COLUMN "version_id",
ADD COLUMN     "periode_id" INTEGER;

-- DropTable
DROP TABLE "_enseignementToperiodes";

-- AddForeignKey
ALTER TABLE "enseignement" ADD CONSTRAINT "enseignement_periode_id_fkey" FOREIGN KEY ("periode_id") REFERENCES "periodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
