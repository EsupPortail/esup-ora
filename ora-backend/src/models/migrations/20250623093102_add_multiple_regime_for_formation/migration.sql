-- AlterTable
ALTER TABLE "formation" ADD COLUMN     "is_regime_fa" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_regime_fc" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_regime_fi" BOOLEAN NOT NULL DEFAULT false;
