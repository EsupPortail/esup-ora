-- CreateTable
CREATE TABLE "_composanteToformation" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_composanteToformation_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_composanteToformation_B_index" ON "_composanteToformation"("B");

-- AddForeignKey
ALTER TABLE "_composanteToformation"
ADD CONSTRAINT "_composanteToformation_A_fkey" FOREIGN KEY ("A") REFERENCES "composante"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_composanteToformation"
ADD CONSTRAINT "_composanteToformation_B_fkey" FOREIGN KEY ("B") REFERENCES "formation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ✅ MIGRATION DES DONNÉES AVANT SUPPRESSION DE LA COLONNE
INSERT INTO "_composanteToformation" ("A", "B") 
SELECT "composante_id", "id" FROM "formation" WHERE "composante_id" IS NOT NULL;

-- Supprimer la contrainte et la colonne après la migration
ALTER TABLE "formation" DROP CONSTRAINT "formation_composante_id_fkey";
ALTER TABLE "formation" DROP COLUMN "composante_id";
