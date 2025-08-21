/*
  Warnings:

  - You are about to drop the column `element_constitutif_id` on the `tags` table. All the data in the column will be lost.
  - You are about to drop the column `enseignement_id` on the `tags` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "tags" DROP CONSTRAINT "tags_element_constitutif_id_fkey";

-- DropForeignKey
ALTER TABLE "tags" DROP CONSTRAINT "tags_enseignement_id_fkey";

-- AlterTable
ALTER TABLE "element_constitutif" ADD COLUMN     "enseignement_id" INTEGER;

-- AlterTable
ALTER TABLE "tags" DROP COLUMN "element_constitutif_id",
DROP COLUMN "enseignement_id";

-- CreateTable
CREATE TABLE "_element_constitutifTotags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_enseignementTotags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_element_constitutifTotags_AB_unique" ON "_element_constitutifTotags"("A", "B");

-- CreateIndex
CREATE INDEX "_element_constitutifTotags_B_index" ON "_element_constitutifTotags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_enseignementTotags_AB_unique" ON "_enseignementTotags"("A", "B");

-- CreateIndex
CREATE INDEX "_enseignementTotags_B_index" ON "_enseignementTotags"("B");

-- AddForeignKey
ALTER TABLE "element_constitutif" ADD CONSTRAINT "element_constitutif_enseignement_id_fkey" FOREIGN KEY ("enseignement_id") REFERENCES "enseignement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_element_constitutifTotags" ADD CONSTRAINT "_element_constitutifTotags_A_fkey" FOREIGN KEY ("A") REFERENCES "element_constitutif"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_element_constitutifTotags" ADD CONSTRAINT "_element_constitutifTotags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_enseignementTotags" ADD CONSTRAINT "_enseignementTotags_A_fkey" FOREIGN KEY ("A") REFERENCES "enseignement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_enseignementTotags" ADD CONSTRAINT "_enseignementTotags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
