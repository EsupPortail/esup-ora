-- AlterTable
ALTER TABLE "unites_enseignement" ADD COLUMN     "ams_connected_id" INTEGER,
ADD COLUMN     "credits_ects" INTEGER,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "est_assoce" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "est_distanciel" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "est_hybride" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "est_isole" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "est_mutualisable" BOOLEAN DEFAULT false,
ADD COLUMN     "est_optionnel" BOOLEAN,
ADD COLUMN     "est_ouvert_etudiants_internationaux" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "est_presentiel" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "nb_etudiant_max" INTEGER,
ADD COLUMN     "obligatoire" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "volume_horaire_cm" INTEGER,
ADD COLUMN     "volume_horaire_cm_td" INTEGER,
ADD COLUMN     "volume_horaire_td" INTEGER,
ADD COLUMN     "volume_horaire_tp" INTEGER;

-- CreateTable
CREATE TABLE "_tagsTounites_enseignement" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_tagsTounites_enseignement_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_UECluster" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UECluster_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_parcoursTounites_enseignement" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_parcoursTounites_enseignement_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_tagsTounites_enseignement_B_index" ON "_tagsTounites_enseignement"("B");

-- CreateIndex
CREATE INDEX "_UECluster_B_index" ON "_UECluster"("B");

-- CreateIndex
CREATE INDEX "_parcoursTounites_enseignement_B_index" ON "_parcoursTounites_enseignement"("B");

-- AddForeignKey
ALTER TABLE "unites_enseignement" ADD CONSTRAINT "unites_enseignement_ams_connected_id_fkey" FOREIGN KEY ("ams_connected_id") REFERENCES "unites_enseignement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_tagsTounites_enseignement" ADD CONSTRAINT "_tagsTounites_enseignement_A_fkey" FOREIGN KEY ("A") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_tagsTounites_enseignement" ADD CONSTRAINT "_tagsTounites_enseignement_B_fkey" FOREIGN KEY ("B") REFERENCES "unites_enseignement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UECluster" ADD CONSTRAINT "_UECluster_A_fkey" FOREIGN KEY ("A") REFERENCES "unites_enseignement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UECluster" ADD CONSTRAINT "_UECluster_B_fkey" FOREIGN KEY ("B") REFERENCES "unites_enseignement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_parcoursTounites_enseignement" ADD CONSTRAINT "_parcoursTounites_enseignement_A_fkey" FOREIGN KEY ("A") REFERENCES "parcours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_parcoursTounites_enseignement" ADD CONSTRAINT "_parcoursTounites_enseignement_B_fkey" FOREIGN KEY ("B") REFERENCES "unites_enseignement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
