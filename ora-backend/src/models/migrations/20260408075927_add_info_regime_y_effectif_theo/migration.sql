-- CreateTable
CREATE TABLE "periode_of_parcours_informations" (
    "id" SERIAL NOT NULL,
    "parcours_id" INTEGER NOT NULL,
    "periode_id" INTEGER NOT NULL,
    "effectif_theorique" INTEGER,
    "is_regime_fa" BOOLEAN NOT NULL DEFAULT false,
    "is_regime_fi" BOOLEAN NOT NULL DEFAULT false,
    "is_regime_fc" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "periode_of_parcours_informations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "periode_of_parcours_informations" ADD CONSTRAINT "periode_of_parcours_informations_parcours_id_fkey" FOREIGN KEY ("parcours_id") REFERENCES "parcours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "periode_of_parcours_informations" ADD CONSTRAINT "periode_of_parcours_informations_periode_id_fkey" FOREIGN KEY ("periode_id") REFERENCES "periodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
