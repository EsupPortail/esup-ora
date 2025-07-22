-- DropForeignKey
ALTER TABLE "_composanteToformation" DROP CONSTRAINT "_composanteToformation_A_fkey";
ALTER TABLE "_composanteToformation" DROP CONSTRAINT "_composanteToformation_B_fkey";

-- Ajout de la colonne, avec NULLABLE pour permettre le remplissage d'abord
ALTER TABLE "formation" ADD COLUMN "composante_id" INTEGER;

-- ✅ Migration des données depuis la table pivot
-- Attention : ici, on suppose qu'il n'y a qu'une seule composante par formation (relation one-to-one ou one-to-many)
UPDATE "formation"
SET "composante_id" = (
  SELECT "A" FROM "_composanteToformation"
  WHERE "_composanteToformation"."B" = "formation"."id"
  LIMIT 1 -- nécessaire si plusieurs composantes (on prend la première arbitrairement)
);
 
-- ⚠️ Si toutes les données ont bien été migrées, on peut rendre la colonne NOT NULL
-- Vérification : SELECT * FROM formation WHERE composante_id IS NULL;
-- Une fois confirmé, on applique :
ALTER TABLE "formation" ALTER COLUMN "composante_id" SET NOT NULL;

-- Suppression de la table pivot
DROP TABLE "_composanteToformation";

-- Ajout de la contrainte de clé étrangère
ALTER TABLE "formation"
ADD CONSTRAINT "formation_composante_id_fkey"
FOREIGN KEY ("composante_id") REFERENCES "composante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
