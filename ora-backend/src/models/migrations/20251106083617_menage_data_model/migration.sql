/*
  Warnings:

  - You are about to drop the column `rncp_id` on the `competence` table. All the data in the column will be lost.
  - You are about to drop the column `rome4_id` on the `competence` table. All the data in the column will be lost.
  - You are about to drop the column `bloc_de_competence_id` on the `element_constitutif` table. All the data in the column will be lost.
  - You are about to drop the column `groupe_ec_id` on the `element_constitutif` table. All the data in the column will be lost.
  - You are about to drop the column `type_enseignement_id` on the `enseignement` table. All the data in the column will be lost.
  - You are about to drop the column `diplome_id` on the `formation` table. All the data in the column will be lost.
  - You are about to drop the column `rncp` on the `version` table. All the data in the column will be lost.
  - You are about to drop the column `rome4` on the `version` table. All the data in the column will be lost.
  - You are about to drop the `_ImportationMutualisation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_apprentissage_critiqueTobloc_de_competence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_bloc_de_competenceTocompetence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_bloc_de_competenceToparcours` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_contexte_evaluationToelement_constitutif` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_critere_exigenceTotype_critere_exigence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_element_constitutifTosae` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_element_constitutifTostage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bloc_de_competence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `caractere_evaluable` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `caractere_evaluable_type` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `categorie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `client_importation_mutualisation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `competence_contextualisee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `contexte_evaluation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `diplome` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `etiquette` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `evaluation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `groupe_ec` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `importation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `namespaces` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notitification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `privilege` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `privilege_role_linker` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rncp` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role_user_linker` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rome4` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sae` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `type_critere_exigence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `type_enseignement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `type_evaluation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `type_formation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ImportationMutualisation" DROP CONSTRAINT "_ImportationMutualisation_A_fkey";

-- DropForeignKey
ALTER TABLE "_ImportationMutualisation" DROP CONSTRAINT "_ImportationMutualisation_B_fkey";

-- DropForeignKey
ALTER TABLE "_apprentissage_critiqueTobloc_de_competence" DROP CONSTRAINT "_apprentissage_critiqueTobloc_de_competence_A_fkey";

-- DropForeignKey
ALTER TABLE "_apprentissage_critiqueTobloc_de_competence" DROP CONSTRAINT "_apprentissage_critiqueTobloc_de_competence_B_fkey";

-- DropForeignKey
ALTER TABLE "_bloc_de_competenceTocompetence" DROP CONSTRAINT "_bloc_de_competenceTocompetence_A_fkey";

-- DropForeignKey
ALTER TABLE "_bloc_de_competenceTocompetence" DROP CONSTRAINT "_bloc_de_competenceTocompetence_B_fkey";

-- DropForeignKey
ALTER TABLE "_bloc_de_competenceToparcours" DROP CONSTRAINT "_bloc_de_competenceToparcours_A_fkey";

-- DropForeignKey
ALTER TABLE "_bloc_de_competenceToparcours" DROP CONSTRAINT "_bloc_de_competenceToparcours_B_fkey";

-- DropForeignKey
ALTER TABLE "_contexte_evaluationToelement_constitutif" DROP CONSTRAINT "_contexte_evaluationToelement_constitutif_A_fkey";

-- DropForeignKey
ALTER TABLE "_contexte_evaluationToelement_constitutif" DROP CONSTRAINT "_contexte_evaluationToelement_constitutif_B_fkey";

-- DropForeignKey
ALTER TABLE "_critere_exigenceTotype_critere_exigence" DROP CONSTRAINT "_critere_exigenceTotype_critere_exigence_A_fkey";

-- DropForeignKey
ALTER TABLE "_critere_exigenceTotype_critere_exigence" DROP CONSTRAINT "_critere_exigenceTotype_critere_exigence_B_fkey";

-- DropForeignKey
ALTER TABLE "_element_constitutifTosae" DROP CONSTRAINT "_element_constitutifTosae_A_fkey";

-- DropForeignKey
ALTER TABLE "_element_constitutifTosae" DROP CONSTRAINT "_element_constitutifTosae_B_fkey";

-- DropForeignKey
ALTER TABLE "_element_constitutifTostage" DROP CONSTRAINT "_element_constitutifTostage_A_fkey";

-- DropForeignKey
ALTER TABLE "_element_constitutifTostage" DROP CONSTRAINT "_element_constitutifTostage_B_fkey";

-- DropForeignKey
ALTER TABLE "bloc_de_competence" DROP CONSTRAINT "bloc_de_competence_version_id_fkey";

-- DropForeignKey
ALTER TABLE "caractere_evaluable" DROP CONSTRAINT "caractere_evaluable_caractere_evaluable_type_id_fkey";

-- DropForeignKey
ALTER TABLE "caractere_evaluable" DROP CONSTRAINT "caractere_evaluable_competence_id_fkey";

-- DropForeignKey
ALTER TABLE "categorie" DROP CONSTRAINT "categorie_namespace_id_fkey";

-- DropForeignKey
ALTER TABLE "competence" DROP CONSTRAINT "competence_rncp_id_fkey";

-- DropForeignKey
ALTER TABLE "competence" DROP CONSTRAINT "competence_rome4_id_fkey";

-- DropForeignKey
ALTER TABLE "contexte_evaluation" DROP CONSTRAINT "contexte_evaluation_competence_id_fkey";

-- DropForeignKey
ALTER TABLE "element_constitutif" DROP CONSTRAINT "element_constitutif_bloc_de_competence_id_fkey";

-- DropForeignKey
ALTER TABLE "element_constitutif" DROP CONSTRAINT "element_constitutif_groupe_ec_id_fkey";

-- DropForeignKey
ALTER TABLE "enseignement" DROP CONSTRAINT "enseignement_type_enseignement_id_fkey";

-- DropForeignKey
ALTER TABLE "etiquette" DROP CONSTRAINT "etiquette_critere_exigence_id_fkey";

-- DropForeignKey
ALTER TABLE "evaluation" DROP CONSTRAINT "evaluation_element_constitutif_id_fkey";

-- DropForeignKey
ALTER TABLE "evaluation" DROP CONSTRAINT "evaluation_type_evaluation_id_fkey";

-- DropForeignKey
ALTER TABLE "formation" DROP CONSTRAINT "formation_diplome_id_fkey";

-- DropForeignKey
ALTER TABLE "groupe_ec" DROP CONSTRAINT "groupe_ec_bloc_de_competence_id_fkey";

-- DropForeignKey
ALTER TABLE "importation" DROP CONSTRAINT "importation_bloc_de_competence_id_fkey";

-- DropForeignKey
ALTER TABLE "importation" DROP CONSTRAINT "importation_element_constitutif_id_fkey";

-- DropForeignKey
ALTER TABLE "privilege" DROP CONSTRAINT "privilege_categorie_id_fkey";

-- DropForeignKey
ALTER TABLE "privilege_role_linker" DROP CONSTRAINT "privilege_role_linker_privilege_id_fkey";

-- DropForeignKey
ALTER TABLE "privilege_role_linker" DROP CONSTRAINT "privilege_role_linker_role_id_fkey";

-- DropForeignKey
ALTER TABLE "role_user_linker" DROP CONSTRAINT "role_user_linker_role_id_fkey";

-- DropForeignKey
ALTER TABLE "sae" DROP CONSTRAINT "sae_famille_de_situation_id_fkey";

-- AlterTable
ALTER TABLE "competence" DROP COLUMN "rncp_id",
DROP COLUMN "rome4_id";

-- AlterTable
ALTER TABLE "element_constitutif" DROP COLUMN "bloc_de_competence_id",
DROP COLUMN "groupe_ec_id";

-- AlterTable
ALTER TABLE "enseignement" DROP COLUMN "type_enseignement_id";

-- AlterTable
ALTER TABLE "formation" DROP COLUMN "diplome_id";

-- AlterTable
ALTER TABLE "version" DROP COLUMN "rncp",
DROP COLUMN "rome4";

-- DropTable
DROP TABLE "_ImportationMutualisation";

-- DropTable
DROP TABLE "_apprentissage_critiqueTobloc_de_competence";

-- DropTable
DROP TABLE "_bloc_de_competenceTocompetence";

-- DropTable
DROP TABLE "_bloc_de_competenceToparcours";

-- DropTable
DROP TABLE "_contexte_evaluationToelement_constitutif";

-- DropTable
DROP TABLE "_critere_exigenceTotype_critere_exigence";

-- DropTable
DROP TABLE "_element_constitutifTosae";

-- DropTable
DROP TABLE "_element_constitutifTostage";

-- DropTable
DROP TABLE "bloc_de_competence";

-- DropTable
DROP TABLE "caractere_evaluable";

-- DropTable
DROP TABLE "caractere_evaluable_type";

-- DropTable
DROP TABLE "categorie";

-- DropTable
DROP TABLE "client_importation_mutualisation";

-- DropTable
DROP TABLE "competence_contextualisee";

-- DropTable
DROP TABLE "contexte_evaluation";

-- DropTable
DROP TABLE "diplome";

-- DropTable
DROP TABLE "etiquette";

-- DropTable
DROP TABLE "evaluation";

-- DropTable
DROP TABLE "groupe_ec";

-- DropTable
DROP TABLE "importation";

-- DropTable
DROP TABLE "namespaces";

-- DropTable
DROP TABLE "notitification";

-- DropTable
DROP TABLE "privilege";

-- DropTable
DROP TABLE "privilege_role_linker";

-- DropTable
DROP TABLE "rncp";

-- DropTable
DROP TABLE "role";

-- DropTable
DROP TABLE "role_user_linker";

-- DropTable
DROP TABLE "rome4";

-- DropTable
DROP TABLE "sae";

-- DropTable
DROP TABLE "stage";

-- DropTable
DROP TABLE "type_critere_exigence";

-- DropTable
DROP TABLE "type_enseignement";

-- DropTable
DROP TABLE "type_evaluation";

-- DropTable
DROP TABLE "type_formation";
