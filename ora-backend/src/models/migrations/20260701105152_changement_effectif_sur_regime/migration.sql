/*
  Warnings:

  - You are about to drop the column `effectif_theorique` on the `periode_of_parcours_informations` table. All the data in the column will be lost.
  - You are about to drop the column `is_regime_fa` on the `periode_of_parcours_informations` table. All the data in the column will be lost.
  - You are about to drop the column `is_regime_fc` on the `periode_of_parcours_informations` table. All the data in the column will be lost.
  - You are about to drop the column `is_regime_fi` on the `periode_of_parcours_informations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "periode_of_parcours_informations" DROP COLUMN "effectif_theorique",
DROP COLUMN "is_regime_fa",
DROP COLUMN "is_regime_fc",
DROP COLUMN "is_regime_fi",
ADD COLUMN     "effectif_theorique_regime_fa" INTEGER,
ADD COLUMN     "effectif_theorique_regime_fc" INTEGER,
ADD COLUMN     "effectif_theorique_regime_fi" INTEGER;
