-- CreateTable
CREATE TABLE "client_importation_mutualisation" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "client_importation_mutualisation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "element_constitutif_mutualised_imported" (
    "id" SERIAL NOT NULL,
    "element_constitutif_id" INTEGER NOT NULL,

    CONSTRAINT "element_constitutif_mutualised_imported_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "element_constitutif_mutualised_imported" ADD CONSTRAINT "element_constitutif_mutualised_imported_element_constituti_fkey" FOREIGN KEY ("element_constitutif_id") REFERENCES "element_constitutif"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
