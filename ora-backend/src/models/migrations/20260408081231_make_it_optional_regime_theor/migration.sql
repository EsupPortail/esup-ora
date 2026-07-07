-- DropForeignKey
ALTER TABLE "periode_of_parcours_informations" DROP CONSTRAINT "periode_of_parcours_informations_parcours_id_fkey";

-- DropForeignKey
ALTER TABLE "periode_of_parcours_informations" DROP CONSTRAINT "periode_of_parcours_informations_periode_id_fkey";

-- AlterTable
ALTER TABLE "periode_of_parcours_informations" ALTER COLUMN "parcours_id" DROP NOT NULL,
ALTER COLUMN "periode_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "periode_of_parcours_informations" ADD CONSTRAINT "periode_of_parcours_informations_parcours_id_fkey" FOREIGN KEY ("parcours_id") REFERENCES "parcours"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "periode_of_parcours_informations" ADD CONSTRAINT "periode_of_parcours_informations_periode_id_fkey" FOREIGN KEY ("periode_id") REFERENCES "periodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
