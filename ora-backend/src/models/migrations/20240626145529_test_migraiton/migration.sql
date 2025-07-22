/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT;

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "Profile";

-- CreateTable
CREATE TABLE "Competence" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "rncpId" INTEGER NOT NULL,
    "rome4Id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Competence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilleDeSituation" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,

    CONSTRAINT "FamilleDeSituation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contexte" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "competenceId" INTEGER NOT NULL,

    CONSTRAINT "Contexte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rncp" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "url" VARCHAR(255) NOT NULL,

    CONSTRAINT "Rncp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rome4" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "url" VARCHAR(255) NOT NULL,

    CONSTRAINT "Rome4_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Version" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "competenceId" INTEGER NOT NULL,

    CONSTRAINT "Version_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ContexteToFamilleDeSituation" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ContexteToFamilleDeSituation_AB_unique" ON "_ContexteToFamilleDeSituation"("A", "B");

-- CreateIndex
CREATE INDEX "_ContexteToFamilleDeSituation_B_index" ON "_ContexteToFamilleDeSituation"("B");

-- AddForeignKey
ALTER TABLE "Competence" ADD CONSTRAINT "Competence_rncpId_fkey" FOREIGN KEY ("rncpId") REFERENCES "Rncp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competence" ADD CONSTRAINT "Competence_rome4Id_fkey" FOREIGN KEY ("rome4Id") REFERENCES "Rome4"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contexte" ADD CONSTRAINT "Contexte_competenceId_fkey" FOREIGN KEY ("competenceId") REFERENCES "Competence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Version" ADD CONSTRAINT "Version_competenceId_fkey" FOREIGN KEY ("competenceId") REFERENCES "Competence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContexteToFamilleDeSituation" ADD CONSTRAINT "_ContexteToFamilleDeSituation_A_fkey" FOREIGN KEY ("A") REFERENCES "Contexte"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContexteToFamilleDeSituation" ADD CONSTRAINT "_ContexteToFamilleDeSituation_B_fkey" FOREIGN KEY ("B") REFERENCES "FamilleDeSituation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
