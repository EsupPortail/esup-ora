/*
  Warnings:

  - You are about to drop the column `enseignement_id` on the `periodes` table. All the data in the column will be lost.
  - Added the required column `version_id` to the `enseignement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `version_id` to the `periodes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "periodes" DROP CONSTRAINT "periodes_enseignement_id_fkey";

-- AlterTable
ALTER TABLE "enseignement" ADD COLUMN     "version_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "periodes" DROP COLUMN "enseignement_id",
ADD COLUMN     "version_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "_enseignementToperiodes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_enseignementToperiodes_AB_unique" ON "_enseignementToperiodes"("A", "B");

-- CreateIndex
CREATE INDEX "_enseignementToperiodes_B_index" ON "_enseignementToperiodes"("B");

-- AddForeignKey
ALTER TABLE "enseignement" ADD CONSTRAINT "enseignement_version_id_fkey" FOREIGN KEY ("version_id") REFERENCES "version"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "periodes" ADD CONSTRAINT "periodes_version_id_fkey" FOREIGN KEY ("version_id") REFERENCES "version"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_enseignementToperiodes" ADD CONSTRAINT "_enseignementToperiodes_A_fkey" FOREIGN KEY ("A") REFERENCES "enseignement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_enseignementToperiodes" ADD CONSTRAINT "_enseignementToperiodes_B_fkey" FOREIGN KEY ("B") REFERENCES "periodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
