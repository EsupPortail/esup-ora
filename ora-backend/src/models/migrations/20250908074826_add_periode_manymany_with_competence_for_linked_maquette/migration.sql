-- CreateTable
CREATE TABLE "_competenceToperiodes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_competenceToperiodes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ElementConstitutifLinkedPeriodes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ElementConstitutifLinkedPeriodes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_competenceToperiodes_B_index" ON "_competenceToperiodes"("B");

-- CreateIndex
CREATE INDEX "_ElementConstitutifLinkedPeriodes_B_index" ON "_ElementConstitutifLinkedPeriodes"("B");

-- AddForeignKey
ALTER TABLE "_competenceToperiodes" ADD CONSTRAINT "_competenceToperiodes_A_fkey" FOREIGN KEY ("A") REFERENCES "competence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_competenceToperiodes" ADD CONSTRAINT "_competenceToperiodes_B_fkey" FOREIGN KEY ("B") REFERENCES "periodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ElementConstitutifLinkedPeriodes" ADD CONSTRAINT "_ElementConstitutifLinkedPeriodes_A_fkey" FOREIGN KEY ("A") REFERENCES "element_constitutif"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ElementConstitutifLinkedPeriodes" ADD CONSTRAINT "_ElementConstitutifLinkedPeriodes_B_fkey" FOREIGN KEY ("B") REFERENCES "periodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
