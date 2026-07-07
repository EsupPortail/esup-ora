-- AlterTable
ALTER TABLE "unites_enseignement" ALTER COLUMN "est_assoce" DROP NOT NULL,
ALTER COLUMN "est_distanciel" DROP NOT NULL,
ALTER COLUMN "est_hybride" DROP NOT NULL,
ALTER COLUMN "est_isole" DROP NOT NULL,
ALTER COLUMN "est_ouvert_etudiants_internationaux" DROP NOT NULL,
ALTER COLUMN "est_presentiel" DROP NOT NULL,
ALTER COLUMN "obligatoire" DROP NOT NULL;
