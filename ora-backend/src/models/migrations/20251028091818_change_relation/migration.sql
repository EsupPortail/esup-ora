/*
  Warnings:

  - You are about to drop the column `ens_options_connected_id` on the `element_constitutif` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "element_constitutif" DROP CONSTRAINT "element_constitutif_ens_options_connected_id_fkey";

-- AlterTable
ALTER TABLE "element_constitutif" DROP COLUMN "ens_options_connected_id";

-- CreateTable
CREATE TABLE "_ECCluster" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ECCluster_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ECCluster_B_index" ON "_ECCluster"("B");

-- AddForeignKey
ALTER TABLE "_ECCluster" ADD CONSTRAINT "_ECCluster_A_fkey" FOREIGN KEY ("A") REFERENCES "element_constitutif"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ECCluster" ADD CONSTRAINT "_ECCluster_B_fkey" FOREIGN KEY ("B") REFERENCES "element_constitutif"("id") ON DELETE CASCADE ON UPDATE CASCADE;
