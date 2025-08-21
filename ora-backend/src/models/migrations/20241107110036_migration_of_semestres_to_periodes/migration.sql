/*
  Warnings:

  - You are about to drop the `semestre` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "semestre" DROP CONSTRAINT "semestre_enseignement_id_fkey";

-- DropTable
DROP TABLE "semestre";

-- CreateTable
CREATE TABLE "periodes" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "enseignement_id" INTEGER NOT NULL,

    CONSTRAINT "periodes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "periodes" ADD CONSTRAINT "periodes_enseignement_id_fkey" FOREIGN KEY ("enseignement_id") REFERENCES "enseignement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
