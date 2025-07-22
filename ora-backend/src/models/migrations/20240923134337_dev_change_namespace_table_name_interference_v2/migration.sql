/*
  Warnings:

  - You are about to drop the `Namespaces` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Categorie" DROP CONSTRAINT "Categorie_namespaceId_fkey";

-- DropTable
DROP TABLE "Namespaces";

-- CreateTable
CREATE TABLE "namespaces" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,

    CONSTRAINT "namespaces_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Categorie" ADD CONSTRAINT "Categorie_namespaceId_fkey" FOREIGN KEY ("namespaceId") REFERENCES "namespaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
