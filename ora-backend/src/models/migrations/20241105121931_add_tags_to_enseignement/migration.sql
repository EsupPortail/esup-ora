-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "enseignement_id" INTEGER NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_enseignement_id_fkey" FOREIGN KEY ("enseignement_id") REFERENCES "enseignement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
