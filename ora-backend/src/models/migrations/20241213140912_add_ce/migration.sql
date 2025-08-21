-- CreateTable
CREATE TABLE "_contexte_evaluationToelement_constitutif" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_contexte_evaluationToelement_constitutif_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_contexte_evaluationToelement_constitutif_B_index" ON "_contexte_evaluationToelement_constitutif"("B");

-- AddForeignKey
ALTER TABLE "_contexte_evaluationToelement_constitutif" ADD CONSTRAINT "_contexte_evaluationToelement_constitutif_A_fkey" FOREIGN KEY ("A") REFERENCES "contexte_evaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_contexte_evaluationToelement_constitutif" ADD CONSTRAINT "_contexte_evaluationToelement_constitutif_B_fkey" FOREIGN KEY ("B") REFERENCES "element_constitutif"("id") ON DELETE CASCADE ON UPDATE CASCADE;
