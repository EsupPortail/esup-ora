/*
  Warnings:

  - You are about to drop the `ApprentissageCritique` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BlocDeCompetence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Categorie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Competence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Composante` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CritereExigence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ElementConstitutif` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Enseignement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EnsembleApprentissageCritique` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Etablissement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Etiquette` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Evaluation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FamilleDeSituation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Formation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Niveau` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Parametre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ParametreElement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Parcours` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Privilege` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PrivilegeRoleLinker` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Rncp` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RoleUserLinker` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Rome4` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sae` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Semestre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TypeCritereExigence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TypeEnseignement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TypeEvaluation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Version` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ApprentissageCritiqueToBlocDeCompetence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CritereExigenceToTypeCritereExigence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ElementConstitutifToEnseignement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ElementConstitutifToSae` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EtablissementToParametre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FormationToParametre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `namespaces` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ApprentissageCritique" DROP CONSTRAINT "ApprentissageCritique_ensembleApprentissageCritiqueId_fkey";

-- DropForeignKey
ALTER TABLE "Categorie" DROP CONSTRAINT "Categorie_namespaceId_fkey";

-- DropForeignKey
ALTER TABLE "Competence" DROP CONSTRAINT "Competence_rncpId_fkey";

-- DropForeignKey
ALTER TABLE "Competence" DROP CONSTRAINT "Competence_rome4Id_fkey";

-- DropForeignKey
ALTER TABLE "Composante" DROP CONSTRAINT "Composante_etablissementId_fkey";

-- DropForeignKey
ALTER TABLE "CritereExigence" DROP CONSTRAINT "CritereExigence_competenceId_fkey";

-- DropForeignKey
ALTER TABLE "ElementConstitutif" DROP CONSTRAINT "ElementConstitutif_blocDeCompetenceId_fkey";

-- DropForeignKey
ALTER TABLE "ElementConstitutif" DROP CONSTRAINT "ElementConstitutif_competenceId_fkey";

-- DropForeignKey
ALTER TABLE "Enseignement" DROP CONSTRAINT "Enseignement_typeEnseignementId_fkey";

-- DropForeignKey
ALTER TABLE "Etiquette" DROP CONSTRAINT "Etiquette_critereExigenceId_fkey";

-- DropForeignKey
ALTER TABLE "Evaluation" DROP CONSTRAINT "Evaluation_elementConstitutifId_fkey";

-- DropForeignKey
ALTER TABLE "Evaluation" DROP CONSTRAINT "Evaluation_typeEvaluationId_fkey";

-- DropForeignKey
ALTER TABLE "FamilleDeSituation" DROP CONSTRAINT "FamilleDeSituation_competenceId_fkey";

-- DropForeignKey
ALTER TABLE "Formation" DROP CONSTRAINT "Formation_composanteId_fkey";

-- DropForeignKey
ALTER TABLE "Niveau" DROP CONSTRAINT "Niveau_apprentissageCritiqueId_fkey";

-- DropForeignKey
ALTER TABLE "ParametreElement" DROP CONSTRAINT "ParametreElement_parametreId_fkey";

-- DropForeignKey
ALTER TABLE "Parcours" DROP CONSTRAINT "Parcours_formationId_fkey";

-- DropForeignKey
ALTER TABLE "Privilege" DROP CONSTRAINT "Privilege_categorieId_fkey";

-- DropForeignKey
ALTER TABLE "PrivilegeRoleLinker" DROP CONSTRAINT "PrivilegeRoleLinker_privilegeId_fkey";

-- DropForeignKey
ALTER TABLE "PrivilegeRoleLinker" DROP CONSTRAINT "PrivilegeRoleLinker_roleId_fkey";

-- DropForeignKey
ALTER TABLE "RoleUserLinker" DROP CONSTRAINT "RoleUserLinker_roleId_fkey";

-- DropForeignKey
ALTER TABLE "Sae" DROP CONSTRAINT "Sae_familleDeSituationId_fkey";

-- DropForeignKey
ALTER TABLE "Semestre" DROP CONSTRAINT "Semestre_enseignementId_fkey";

-- DropForeignKey
ALTER TABLE "Version" DROP CONSTRAINT "Version_competenceId_fkey";

-- DropForeignKey
ALTER TABLE "Version" DROP CONSTRAINT "Version_parcoursId_fkey";

-- DropForeignKey
ALTER TABLE "_ApprentissageCritiqueToBlocDeCompetence" DROP CONSTRAINT "_ApprentissageCritiqueToBlocDeCompetence_A_fkey";

-- DropForeignKey
ALTER TABLE "_ApprentissageCritiqueToBlocDeCompetence" DROP CONSTRAINT "_ApprentissageCritiqueToBlocDeCompetence_B_fkey";

-- DropForeignKey
ALTER TABLE "_CritereExigenceToTypeCritereExigence" DROP CONSTRAINT "_CritereExigenceToTypeCritereExigence_A_fkey";

-- DropForeignKey
ALTER TABLE "_CritereExigenceToTypeCritereExigence" DROP CONSTRAINT "_CritereExigenceToTypeCritereExigence_B_fkey";

-- DropForeignKey
ALTER TABLE "_ElementConstitutifToEnseignement" DROP CONSTRAINT "_ElementConstitutifToEnseignement_A_fkey";

-- DropForeignKey
ALTER TABLE "_ElementConstitutifToEnseignement" DROP CONSTRAINT "_ElementConstitutifToEnseignement_B_fkey";

-- DropForeignKey
ALTER TABLE "_ElementConstitutifToSae" DROP CONSTRAINT "_ElementConstitutifToSae_A_fkey";

-- DropForeignKey
ALTER TABLE "_ElementConstitutifToSae" DROP CONSTRAINT "_ElementConstitutifToSae_B_fkey";

-- DropForeignKey
ALTER TABLE "_EtablissementToParametre" DROP CONSTRAINT "_EtablissementToParametre_A_fkey";

-- DropForeignKey
ALTER TABLE "_EtablissementToParametre" DROP CONSTRAINT "_EtablissementToParametre_B_fkey";

-- DropForeignKey
ALTER TABLE "_FormationToParametre" DROP CONSTRAINT "_FormationToParametre_A_fkey";

-- DropForeignKey
ALTER TABLE "_FormationToParametre" DROP CONSTRAINT "_FormationToParametre_B_fkey";

-- DropTable
DROP TABLE "ApprentissageCritique";

-- DropTable
DROP TABLE "BlocDeCompetence";

-- DropTable
DROP TABLE "Categorie";

-- DropTable
DROP TABLE "Competence";

-- DropTable
DROP TABLE "Composante";

-- DropTable
DROP TABLE "CritereExigence";

-- DropTable
DROP TABLE "ElementConstitutif";

-- DropTable
DROP TABLE "Enseignement";

-- DropTable
DROP TABLE "EnsembleApprentissageCritique";

-- DropTable
DROP TABLE "Etablissement";

-- DropTable
DROP TABLE "Etiquette";

-- DropTable
DROP TABLE "Evaluation";

-- DropTable
DROP TABLE "FamilleDeSituation";

-- DropTable
DROP TABLE "Formation";

-- DropTable
DROP TABLE "Niveau";

-- DropTable
DROP TABLE "Parametre";

-- DropTable
DROP TABLE "ParametreElement";

-- DropTable
DROP TABLE "Parcours";

-- DropTable
DROP TABLE "Privilege";

-- DropTable
DROP TABLE "PrivilegeRoleLinker";

-- DropTable
DROP TABLE "Rncp";

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "RoleUserLinker";

-- DropTable
DROP TABLE "Rome4";

-- DropTable
DROP TABLE "Sae";

-- DropTable
DROP TABLE "Semestre";

-- DropTable
DROP TABLE "TypeCritereExigence";

-- DropTable
DROP TABLE "TypeEnseignement";

-- DropTable
DROP TABLE "TypeEvaluation";

-- DropTable
DROP TABLE "Version";

-- DropTable
DROP TABLE "_ApprentissageCritiqueToBlocDeCompetence";

-- DropTable
DROP TABLE "_CritereExigenceToTypeCritereExigence";

-- DropTable
DROP TABLE "_ElementConstitutifToEnseignement";

-- DropTable
DROP TABLE "_ElementConstitutifToSae";

-- DropTable
DROP TABLE "_EtablissementToParametre";

-- DropTable
DROP TABLE "_FormationToParametre";

-- DropTable
DROP TABLE "namespaces";

-- CreateTable
CREATE TABLE "competence" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "rncp_id" INTEGER,
    "rome4_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "competence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ensemble_apprentissage_critique" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,

    CONSTRAINT "ensemble_apprentissage_critique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apprentissage_critique" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "ensemble_apprentissage_critique_id" INTEGER NOT NULL,

    CONSTRAINT "apprentissage_critique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "niveau" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "apprentissage_critique_id" INTEGER NOT NULL,

    CONSTRAINT "niveau_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "famille_de_situation" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "competence_id" INTEGER NOT NULL,

    CONSTRAINT "famille_de_situation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sae" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "famille_de_situation_id" INTEGER NOT NULL,

    CONSTRAINT "sae_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "element_constitutif" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "competence_id" INTEGER NOT NULL,
    "bloc_de_competence_id" INTEGER NOT NULL,

    CONSTRAINT "element_constitutif_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluation" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "element_constitutif_id" INTEGER NOT NULL,
    "type_evaluation_id" INTEGER NOT NULL,

    CONSTRAINT "evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "type_evaluation" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,

    CONSTRAINT "type_evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "critere_exigence" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "competence_id" INTEGER NOT NULL,

    CONSTRAINT "critere_exigence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "type_critere_exigence" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,

    CONSTRAINT "type_critere_exigence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enseignement" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "type_enseignement_id" INTEGER NOT NULL,

    CONSTRAINT "enseignement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "semestre" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "enseignement_id" INTEGER NOT NULL,

    CONSTRAINT "semestre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "type_enseignement" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,

    CONSTRAINT "type_enseignement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "etiquette" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "critere_exigence_id" INTEGER NOT NULL,

    CONSTRAINT "etiquette_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bloc_de_competence" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,

    CONSTRAINT "bloc_de_competence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rncp" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "url" VARCHAR(255) NOT NULL,

    CONSTRAINT "rncp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rome4" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "url" VARCHAR(255) NOT NULL,

    CONSTRAINT "rome4_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "version" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "competence_id" INTEGER NOT NULL,
    "parcours_id" INTEGER NOT NULL,

    CONSTRAINT "version_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parcours" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "formation_id" INTEGER NOT NULL,

    CONSTRAINT "parcours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formation" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "composante_id" INTEGER NOT NULL,

    CONSTRAINT "formation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "composante" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "etablissement_id" INTEGER NOT NULL,

    CONSTRAINT "composante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "etablissement" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,

    CONSTRAINT "etablissement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parametre" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "parametre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parametre_element" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,
    "value" VARCHAR(255) NOT NULL,
    "parametre_id" INTEGER NOT NULL,

    CONSTRAINT "parametre_element_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

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
CREATE TABLE "namespace" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,

    CONSTRAINT "namespace_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "_apprentissage_critiqueTobloc_de_competence" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_element_constitutifTosae" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_element_constitutifToenseignement" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_critere_exigenceTotype_critere_exigence" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_formationToparametre" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_etablissementToparametre" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "element_constitutif_competence_id_key" ON "element_constitutif"("competence_id");

-- CreateIndex
CREATE UNIQUE INDEX "element_constitutif_bloc_de_competence_id_key" ON "element_constitutif"("bloc_de_competence_id");

-- CreateIndex
CREATE UNIQUE INDEX "evaluation_element_constitutif_id_key" ON "evaluation"("element_constitutif_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_apprentissage_critiqueTobloc_de_competence_AB_unique" ON "_apprentissage_critiqueTobloc_de_competence"("A", "B");

-- CreateIndex
CREATE INDEX "_apprentissage_critiqueTobloc_de_competence_B_index" ON "_apprentissage_critiqueTobloc_de_competence"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_element_constitutifTosae_AB_unique" ON "_element_constitutifTosae"("A", "B");

-- CreateIndex
CREATE INDEX "_element_constitutifTosae_B_index" ON "_element_constitutifTosae"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_element_constitutifToenseignement_AB_unique" ON "_element_constitutifToenseignement"("A", "B");

-- CreateIndex
CREATE INDEX "_element_constitutifToenseignement_B_index" ON "_element_constitutifToenseignement"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_critere_exigenceTotype_critere_exigence_AB_unique" ON "_critere_exigenceTotype_critere_exigence"("A", "B");

-- CreateIndex
CREATE INDEX "_critere_exigenceTotype_critere_exigence_B_index" ON "_critere_exigenceTotype_critere_exigence"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_formationToparametre_AB_unique" ON "_formationToparametre"("A", "B");

-- CreateIndex
CREATE INDEX "_formationToparametre_B_index" ON "_formationToparametre"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_etablissementToparametre_AB_unique" ON "_etablissementToparametre"("A", "B");

-- CreateIndex
CREATE INDEX "_etablissementToparametre_B_index" ON "_etablissementToparametre"("B");

-- AddForeignKey
ALTER TABLE "competence" ADD CONSTRAINT "competence_rncp_id_fkey" FOREIGN KEY ("rncp_id") REFERENCES "rncp"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competence" ADD CONSTRAINT "competence_rome4_id_fkey" FOREIGN KEY ("rome4_id") REFERENCES "rome4"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apprentissage_critique" ADD CONSTRAINT "apprentissage_critique_ensemble_apprentissage_critique_id_fkey" FOREIGN KEY ("ensemble_apprentissage_critique_id") REFERENCES "ensemble_apprentissage_critique"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "niveau" ADD CONSTRAINT "niveau_apprentissage_critique_id_fkey" FOREIGN KEY ("apprentissage_critique_id") REFERENCES "apprentissage_critique"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "famille_de_situation" ADD CONSTRAINT "famille_de_situation_competence_id_fkey" FOREIGN KEY ("competence_id") REFERENCES "competence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sae" ADD CONSTRAINT "sae_famille_de_situation_id_fkey" FOREIGN KEY ("famille_de_situation_id") REFERENCES "famille_de_situation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "element_constitutif" ADD CONSTRAINT "element_constitutif_competence_id_fkey" FOREIGN KEY ("competence_id") REFERENCES "competence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "element_constitutif" ADD CONSTRAINT "element_constitutif_bloc_de_competence_id_fkey" FOREIGN KEY ("bloc_de_competence_id") REFERENCES "bloc_de_competence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation" ADD CONSTRAINT "evaluation_element_constitutif_id_fkey" FOREIGN KEY ("element_constitutif_id") REFERENCES "element_constitutif"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation" ADD CONSTRAINT "evaluation_type_evaluation_id_fkey" FOREIGN KEY ("type_evaluation_id") REFERENCES "type_evaluation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "critere_exigence" ADD CONSTRAINT "critere_exigence_competence_id_fkey" FOREIGN KEY ("competence_id") REFERENCES "competence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enseignement" ADD CONSTRAINT "enseignement_type_enseignement_id_fkey" FOREIGN KEY ("type_enseignement_id") REFERENCES "type_enseignement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "semestre" ADD CONSTRAINT "semestre_enseignement_id_fkey" FOREIGN KEY ("enseignement_id") REFERENCES "enseignement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "etiquette" ADD CONSTRAINT "etiquette_critere_exigence_id_fkey" FOREIGN KEY ("critere_exigence_id") REFERENCES "critere_exigence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "version" ADD CONSTRAINT "version_competence_id_fkey" FOREIGN KEY ("competence_id") REFERENCES "competence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "version" ADD CONSTRAINT "version_parcours_id_fkey" FOREIGN KEY ("parcours_id") REFERENCES "parcours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parcours" ADD CONSTRAINT "parcours_formation_id_fkey" FOREIGN KEY ("formation_id") REFERENCES "formation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formation" ADD CONSTRAINT "formation_composante_id_fkey" FOREIGN KEY ("composante_id") REFERENCES "composante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "composante" ADD CONSTRAINT "composante_etablissement_id_fkey" FOREIGN KEY ("etablissement_id") REFERENCES "etablissement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parametre_element" ADD CONSTRAINT "parametre_element_parametre_id_fkey" FOREIGN KEY ("parametre_id") REFERENCES "parametre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "privilege" ADD CONSTRAINT "privilege_categorie_id_fkey" FOREIGN KEY ("categorie_id") REFERENCES "categorie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorie" ADD CONSTRAINT "categorie_namespace_id_fkey" FOREIGN KEY ("namespace_id") REFERENCES "namespace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "privilege_role_linker" ADD CONSTRAINT "privilege_role_linker_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "privilege_role_linker" ADD CONSTRAINT "privilege_role_linker_privilege_id_fkey" FOREIGN KEY ("privilege_id") REFERENCES "privilege"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_user_linker" ADD CONSTRAINT "role_user_linker_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_apprentissage_critiqueTobloc_de_competence" ADD CONSTRAINT "_apprentissage_critiqueTobloc_de_competence_A_fkey" FOREIGN KEY ("A") REFERENCES "apprentissage_critique"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_apprentissage_critiqueTobloc_de_competence" ADD CONSTRAINT "_apprentissage_critiqueTobloc_de_competence_B_fkey" FOREIGN KEY ("B") REFERENCES "bloc_de_competence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_element_constitutifTosae" ADD CONSTRAINT "_element_constitutifTosae_A_fkey" FOREIGN KEY ("A") REFERENCES "element_constitutif"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_element_constitutifTosae" ADD CONSTRAINT "_element_constitutifTosae_B_fkey" FOREIGN KEY ("B") REFERENCES "sae"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_element_constitutifToenseignement" ADD CONSTRAINT "_element_constitutifToenseignement_A_fkey" FOREIGN KEY ("A") REFERENCES "element_constitutif"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_element_constitutifToenseignement" ADD CONSTRAINT "_element_constitutifToenseignement_B_fkey" FOREIGN KEY ("B") REFERENCES "enseignement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_critere_exigenceTotype_critere_exigence" ADD CONSTRAINT "_critere_exigenceTotype_critere_exigence_A_fkey" FOREIGN KEY ("A") REFERENCES "critere_exigence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_critere_exigenceTotype_critere_exigence" ADD CONSTRAINT "_critere_exigenceTotype_critere_exigence_B_fkey" FOREIGN KEY ("B") REFERENCES "type_critere_exigence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_formationToparametre" ADD CONSTRAINT "_formationToparametre_A_fkey" FOREIGN KEY ("A") REFERENCES "formation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_formationToparametre" ADD CONSTRAINT "_formationToparametre_B_fkey" FOREIGN KEY ("B") REFERENCES "parametre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_etablissementToparametre" ADD CONSTRAINT "_etablissementToparametre_A_fkey" FOREIGN KEY ("A") REFERENCES "etablissement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_etablissementToparametre" ADD CONSTRAINT "_etablissementToparametre_B_fkey" FOREIGN KEY ("B") REFERENCES "parametre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
