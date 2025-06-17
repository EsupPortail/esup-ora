/*
  Warnings:

  - You are about to drop the `RoleToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RoleToUser" DROP CONSTRAINT "RoleToUser_roleId_fkey";

-- DropTable
DROP TABLE "RoleToUser";

-- CreateTable
CREATE TABLE "RoleUserLinker" (
    "idUserKeycloak" VARCHAR(255) NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "RoleUserLinker_pkey" PRIMARY KEY ("idUserKeycloak","roleId")
);

-- AddForeignKey
ALTER TABLE "RoleUserLinker" ADD CONSTRAINT "RoleUserLinker_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
