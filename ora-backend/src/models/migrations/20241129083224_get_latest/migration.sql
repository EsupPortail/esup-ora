-- CreateTable
CREATE TABLE "caractere_evaluable" (
    "id" SERIAL NOT NULL,
    "caractere_evaluable_type_id" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "competence_id" INTEGER NOT NULL,

    CONSTRAINT "caractere_evaluable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caractere_evaluable_type" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,

    CONSTRAINT "caractere_evaluable_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contexte_evaluation" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "ordre" INTEGER NOT NULL,
    "competence_id" INTEGER NOT NULL,

    CONSTRAINT "contexte_evaluation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "caractere_evaluable" ADD CONSTRAINT "caractere_evaluable_caractere_evaluable_type_id_fkey" FOREIGN KEY ("caractere_evaluable_type_id") REFERENCES "caractere_evaluable_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caractere_evaluable" ADD CONSTRAINT "caractere_evaluable_competence_id_fkey" FOREIGN KEY ("competence_id") REFERENCES "competence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contexte_evaluation" ADD CONSTRAINT "contexte_evaluation_competence_id_fkey" FOREIGN KEY ("competence_id") REFERENCES "competence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
