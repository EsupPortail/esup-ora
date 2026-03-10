-- AlterTable
ALTER TABLE "element_constitutif_mutualised_imported" ADD COLUMN     "periode_id" INTEGER;

-- CreateTable
CREATE TABLE "notitification" (
    "id" SERIAL NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notitification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "element_constitutif_mutualised_imported" ADD CONSTRAINT "element_constitutif_mutualised_imported_periode_id_fkey" FOREIGN KEY ("periode_id") REFERENCES "periodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
