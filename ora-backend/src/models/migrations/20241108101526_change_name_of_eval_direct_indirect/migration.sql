/*
  Warnings:

  - You are about to drop the column `estEvaluationDirect` on the `enseignement` table. All the data in the column will be lost.
  - You are about to drop the column `estEvaluationIndirect` on the `enseignement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "enseignement" DROP COLUMN "estEvaluationDirect",
DROP COLUMN "estEvaluationIndirect",
ADD COLUMN     "est_evaluation_directe" BOOLEAN,
ADD COLUMN     "est_evaluation_indirecte" BOOLEAN;
