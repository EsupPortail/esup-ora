/*
  Warnings:

  - You are about to drop the `namespace` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "categorie" DROP CONSTRAINT "categorie_namespace_id_fkey";

-- DropTable
DROP TABLE "namespace";

-- CreateTable
CREATE TABLE "namespaces" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,

    CONSTRAINT "namespaces_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "categorie" ADD CONSTRAINT "categorie_namespace_id_fkey" FOREIGN KEY ("namespace_id") REFERENCES "namespaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
