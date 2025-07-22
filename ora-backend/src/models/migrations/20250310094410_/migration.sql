/*
  Warnings:

  - The `presentiel` column on the `element_constitutif` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `nb_credits` on the `parametre` table. All the data in the column will be lost.
  - You are about to drop the column `nb_heures_enseignement` on the `parametre` table. All the data in the column will be lost.
  - You are about to drop the `_etablissementToparametre` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_etablissementToparametre" DROP CONSTRAINT "_etablissementToparametre_A_fkey";

-- DropForeignKey
ALTER TABLE "_etablissementToparametre" DROP CONSTRAINT "_etablissementToparametre_B_fkey";

-- DropForeignKey
ALTER TABLE "formation" DROP CONSTRAINT "formation_diplome_id_fkey";

-- AlterTable
ALTER TABLE "element_constitutif" DROP COLUMN "presentiel",
ADD COLUMN     "presentiel" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "etablissement" ADD COLUMN     "parametre_id" INTEGER;

-- AlterTable
ALTER TABLE "formation" ADD COLUMN     "effectif_theorique" INTEGER,
ADD COLUMN     "regime" VARCHAR(255),
ADD COLUMN     "type_diplome_id" INTEGER,
ALTER COLUMN "diplome_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "parametre" DROP COLUMN "nb_credits",
DROP COLUMN "nb_heures_enseignement",
ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "tags" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- DropTable
DROP TABLE "_etablissementToparametre";

-- CreateTable
CREATE TABLE "type_diplome" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "heures" INTEGER,
    "credits" INTEGER,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "type_diplome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_parametreTotype_diplome" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_parametreTotype_diplome_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_parametreTotags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_parametreTotags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_parametreTotype_diplome_B_index" ON "_parametreTotype_diplome"("B");

-- CreateIndex
CREATE INDEX "_parametreTotags_B_index" ON "_parametreTotags"("B");

-- AddForeignKey
ALTER TABLE "formation" ADD CONSTRAINT "formation_diplome_id_fkey" FOREIGN KEY ("diplome_id") REFERENCES "diplome"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formation" ADD CONSTRAINT "formation_type_diplome_id_fkey" FOREIGN KEY ("type_diplome_id") REFERENCES "type_diplome"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "etablissement" ADD CONSTRAINT "etablissement_parametre_id_fkey" FOREIGN KEY ("parametre_id") REFERENCES "parametre"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_parametreTotype_diplome" ADD CONSTRAINT "_parametreTotype_diplome_A_fkey" FOREIGN KEY ("A") REFERENCES "parametre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_parametreTotype_diplome" ADD CONSTRAINT "_parametreTotype_diplome_B_fkey" FOREIGN KEY ("B") REFERENCES "type_diplome"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_parametreTotags" ADD CONSTRAINT "_parametreTotags_A_fkey" FOREIGN KEY ("A") REFERENCES "parametre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_parametreTotags" ADD CONSTRAINT "_parametreTotags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
