/*
  Warnings:

  - You are about to drop the `categorie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `namespaces` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `privilege` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `privilege_role_linker` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role_user_linker` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "categorie" DROP CONSTRAINT "categorie_namespace_id_fkey";

-- DropForeignKey
ALTER TABLE "privilege" DROP CONSTRAINT "privilege_categorie_id_fkey";

-- DropForeignKey
ALTER TABLE "privilege_role_linker" DROP CONSTRAINT "privilege_role_linker_privilege_id_fkey";

-- DropForeignKey
ALTER TABLE "privilege_role_linker" DROP CONSTRAINT "privilege_role_linker_role_id_fkey";

-- DropForeignKey
ALTER TABLE "role_user_linker" DROP CONSTRAINT "role_user_linker_role_id_fkey";

-- DropTable
DROP TABLE "categorie";

-- DropTable
DROP TABLE "namespaces";

-- DropTable
DROP TABLE "privilege";

-- DropTable
DROP TABLE "privilege_role_linker";

-- DropTable
DROP TABLE "role";

-- DropTable
DROP TABLE "role_user_linker";
