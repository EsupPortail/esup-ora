/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roleId_fkey";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Privilege" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "ordre" INTEGER NOT NULL,
    "categorieId" INTEGER NOT NULL,

    CONSTRAINT "Privilege_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categorie" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "ordre" INTEGER NOT NULL,
    "namespaceId" INTEGER NOT NULL,

    CONSTRAINT "Categorie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Namespaces" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,

    CONSTRAINT "Namespaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrivilegeRoleLinker" (
    "roleId" INTEGER NOT NULL,
    "privilegeId" INTEGER NOT NULL,

    CONSTRAINT "PrivilegeRoleLinker_pkey" PRIMARY KEY ("roleId","privilegeId")
);

-- CreateTable
CREATE TABLE "RoleUserLinker" (
    "idUserKeycloak" VARCHAR(255) NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "RoleUserLinker_pkey" PRIMARY KEY ("idUserKeycloak","roleId")
);

-- AddForeignKey
ALTER TABLE "Privilege" ADD CONSTRAINT "Privilege_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "Categorie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categorie" ADD CONSTRAINT "Categorie_namespaceId_fkey" FOREIGN KEY ("namespaceId") REFERENCES "Namespaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivilegeRoleLinker" ADD CONSTRAINT "PrivilegeRoleLinker_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivilegeRoleLinker" ADD CONSTRAINT "PrivilegeRoleLinker_privilegeId_fkey" FOREIGN KEY ("privilegeId") REFERENCES "Privilege"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleUserLinker" ADD CONSTRAINT "RoleUserLinker_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
