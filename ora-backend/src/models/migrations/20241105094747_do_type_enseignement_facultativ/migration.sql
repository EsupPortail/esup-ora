-- DropForeignKey
ALTER TABLE "enseignement" DROP CONSTRAINT "enseignement_type_enseignement_id_fkey";

-- AlterTable
ALTER TABLE "enseignement" ALTER COLUMN "type_enseignement_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "enseignement" ADD CONSTRAINT "enseignement_type_enseignement_id_fkey" FOREIGN KEY ("type_enseignement_id") REFERENCES "type_enseignement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
