-- AlterTable
ALTER TABLE "element_constitutif" ADD COLUMN     "est_assoce" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "est_isole" BOOLEAN NOT NULL DEFAULT false;
