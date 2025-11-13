-- CreateTable
CREATE TABLE "_element_constitutifToparcours" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_element_constitutifToparcours_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "_element_constitutifToparcours_B_index" ON "_element_constitutifToparcours"("B");

-- AddForeignKey
ALTER TABLE "_element_constitutifToparcours" ADD CONSTRAINT "_element_constitutifToparcours_A_fkey" FOREIGN KEY ("A") REFERENCES "element_constitutif"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_element_constitutifToparcours" ADD CONSTRAINT "_element_constitutifToparcours_B_fkey" FOREIGN KEY ("B") REFERENCES "parcours"("id") ON DELETE CASCADE ON UPDATE CASCADE;
