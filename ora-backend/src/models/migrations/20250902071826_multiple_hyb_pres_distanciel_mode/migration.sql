-- AlterTable
ALTER TABLE "element_constitutif" ADD COLUMN     "est_distanciel" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "est_hybride" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "est_presentiel" BOOLEAN NOT NULL DEFAULT false;
