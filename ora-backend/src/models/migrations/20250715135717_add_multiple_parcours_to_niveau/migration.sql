-- CreateTable
CREATE TABLE "_niveauToparcours" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_niveauToparcours_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_niveauToparcours_B_index" ON "_niveauToparcours"("B");

-- AddForeignKey
ALTER TABLE "_niveauToparcours" ADD CONSTRAINT "_niveauToparcours_A_fkey" FOREIGN KEY ("A") REFERENCES "niveau"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_niveauToparcours" ADD CONSTRAINT "_niveauToparcours_B_fkey" FOREIGN KEY ("B") REFERENCES "parcours"("id") ON DELETE CASCADE ON UPDATE CASCADE;
