-- AlterTable
ALTER TABLE "periodes" ADD COLUMN     "effectif_theorique" INTEGER,
ADD COLUMN     "is_fa" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_fc" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_fi" BOOLEAN NOT NULL DEFAULT false;
