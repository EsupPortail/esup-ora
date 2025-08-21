/*
  Warnings:

  - You are about to drop the column `competence_id` on the `competence_contextualisee` table. All the data in the column will be lost.
  - You are about to drop the column `apprentissage_critique_id` on the `niveau` table. All the data in the column will be lost.
  - Added the required column `niveau_id` to the `apprentissage_critique` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ordre` to the `apprentissage_critique` table without a default value. This is not possible if the table is not empty.
  - Added the required column `competence_id` to the `niveau` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "apprentissage_critique" DROP CONSTRAINT "apprentissage_critique_ensemble_apprentissage_critique_id_fkey";

-- DropForeignKey
ALTER TABLE "competence_contextualisee" DROP CONSTRAINT "competence_contextualisee_competence_id_fkey";

-- DropForeignKey
ALTER TABLE "niveau" DROP CONSTRAINT "niveau_apprentissage_critique_id_fkey";

-- AlterTable
ALTER TABLE "apprentissage_critique" ADD COLUMN     "niveau_id" INTEGER NOT NULL,
ADD COLUMN     "ordre" INTEGER NOT NULL,
ALTER COLUMN "ensemble_apprentissage_critique_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "competence" ADD COLUMN     "competence_contextualisee" VARCHAR(255);

-- AlterTable
ALTER TABLE "competence_contextualisee" DROP COLUMN "competence_id";

-- AlterTable
ALTER TABLE "niveau" DROP COLUMN "apprentissage_critique_id",
ADD COLUMN     "competence_id" INTEGER NOT NULL,
ADD COLUMN     "description" VARCHAR(255);

-- AddForeignKey
ALTER TABLE "apprentissage_critique" ADD CONSTRAINT "apprentissage_critique_ensemble_apprentissage_critique_id_fkey" FOREIGN KEY ("ensemble_apprentissage_critique_id") REFERENCES "ensemble_apprentissage_critique"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apprentissage_critique" ADD CONSTRAINT "apprentissage_critique_niveau_id_fkey" FOREIGN KEY ("niveau_id") REFERENCES "niveau"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "niveau" ADD CONSTRAINT "niveau_competence_id_fkey" FOREIGN KEY ("competence_id") REFERENCES "competence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
