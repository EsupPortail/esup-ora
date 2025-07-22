/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `composante` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `etablissement` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "_apprentissage_critiqueTobloc_de_competence" ADD CONSTRAINT "_apprentissage_critiqueTobloc_de_competence_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_apprentissage_critiqueTobloc_de_competence_AB_unique";

-- AlterTable
ALTER TABLE "_apprentissage_critiqueToenseignement" ADD CONSTRAINT "_apprentissage_critiqueToenseignement_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_apprentissage_critiqueToenseignement_AB_unique";

-- AlterTable
ALTER TABLE "_critere_exigenceTotype_critere_exigence" ADD CONSTRAINT "_critere_exigenceTotype_critere_exigence_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_critere_exigenceTotype_critere_exigence_AB_unique";

-- AlterTable
ALTER TABLE "_element_constitutifTosae" ADD CONSTRAINT "_element_constitutifTosae_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_element_constitutifTosae_AB_unique";

-- AlterTable
ALTER TABLE "_element_constitutifTotags" ADD CONSTRAINT "_element_constitutifTotags_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_element_constitutifTotags_AB_unique";

-- AlterTable
ALTER TABLE "_enseignementTotags" ADD CONSTRAINT "_enseignementTotags_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_enseignementTotags_AB_unique";

-- AlterTable
ALTER TABLE "_etablissementToparametre" ADD CONSTRAINT "_etablissementToparametre_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_etablissementToparametre_AB_unique";

-- AlterTable
ALTER TABLE "_formationToparametre" ADD CONSTRAINT "_formationToparametre_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_formationToparametre_AB_unique";

-- AlterTable
ALTER TABLE "composante" ADD COLUMN     "code" VARCHAR(255);

-- AlterTable
ALTER TABLE "etablissement" ADD COLUMN     "code" VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "composante_code_key" ON "composante"("code");

-- CreateIndex
CREATE UNIQUE INDEX "etablissement_code_key" ON "etablissement"("code");
