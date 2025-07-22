-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" VARCHAR(255) NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "privilege" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "ordre" INTEGER NOT NULL,
    "categorie_id" INTEGER NOT NULL,

    CONSTRAINT "privilege_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorie" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "ordre" INTEGER NOT NULL,
    "namespace_id" INTEGER NOT NULL,

    CONSTRAINT "categorie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "namespaces" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,

    CONSTRAINT "namespaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "privilege_role_linker" (
    "role_id" INTEGER NOT NULL,
    "privilege_id" INTEGER NOT NULL,

    CONSTRAINT "privilege_role_linker_pkey" PRIMARY KEY ("role_id","privilege_id")
);

-- CreateTable
CREATE TABLE "role_user_linker" (
    "id_user_keycloak" VARCHAR(255) NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "role_user_linker_pkey" PRIMARY KEY ("id_user_keycloak","role_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- AddForeignKey
ALTER TABLE "privilege" ADD CONSTRAINT "privilege_categorie_id_fkey" FOREIGN KEY ("categorie_id") REFERENCES "categorie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorie" ADD CONSTRAINT "categorie_namespace_id_fkey" FOREIGN KEY ("namespace_id") REFERENCES "namespaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "privilege_role_linker" ADD CONSTRAINT "privilege_role_linker_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "privilege_role_linker" ADD CONSTRAINT "privilege_role_linker_privilege_id_fkey" FOREIGN KEY ("privilege_id") REFERENCES "privilege"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_user_linker" ADD CONSTRAINT "role_user_linker_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
