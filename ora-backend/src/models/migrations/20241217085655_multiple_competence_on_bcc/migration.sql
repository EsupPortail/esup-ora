/*
  Warnings:

  - You are about to drop the column `competence_id` on the `bloc_de_competence` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "bloc_de_competence" DROP CONSTRAINT "bloc_de_competence_competence_id_fkey";

-- AlterTable
ALTER TABLE "bloc_de_competence" DROP COLUMN "competence_id";

-- CreateTable
CREATE TABLE "_bloc_de_competenceTocompetence" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_bloc_de_competenceTocompetence_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_bloc_de_competenceTocompetence_B_index" ON "_bloc_de_competenceTocompetence"("B");

-- AddForeignKey
ALTER TABLE "_bloc_de_competenceTocompetence" ADD CONSTRAINT "_bloc_de_competenceTocompetence_A_fkey" FOREIGN KEY ("A") REFERENCES "bloc_de_competence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_bloc_de_competenceTocompetence" ADD CONSTRAINT "_bloc_de_competenceTocompetence_B_fkey" FOREIGN KEY ("B") REFERENCES "competence"("id") ON DELETE CASCADE ON UPDATE CASCADE;
