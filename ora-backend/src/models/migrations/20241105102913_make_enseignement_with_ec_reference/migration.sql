/*
  Warnings:

  - You are about to drop the `_element_constitutifToenseignement` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_element_constitutifToenseignement" DROP CONSTRAINT "_element_constitutifToenseignement_A_fkey";

-- DropForeignKey
ALTER TABLE "_element_constitutifToenseignement" DROP CONSTRAINT "_element_constitutifToenseignement_B_fkey";

-- DropTable
DROP TABLE "_element_constitutifToenseignement";

-- AddForeignKey
ALTER TABLE "enseignement" ADD CONSTRAINT "enseignement_element_constitutif_id_fkey" FOREIGN KEY ("element_constitutif_id") REFERENCES "element_constitutif"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
