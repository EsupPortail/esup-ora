-- AlterTable
ALTER TABLE "composante" ADD COLUMN     "is_imported_by_connector" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "etablissement" ADD COLUMN     "is_imported_by_connector" BOOLEAN DEFAULT false;
