-- CreateTable
CREATE TABLE "rncp_bcc" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,

    CONSTRAINT "rncp_bcc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_competenceTorncp_bcc" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_competenceTorncp_bcc_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_competenceTorncp_bcc_B_index" ON "_competenceTorncp_bcc"("B");

-- AddForeignKey
ALTER TABLE "_competenceTorncp_bcc" ADD CONSTRAINT "_competenceTorncp_bcc_A_fkey" FOREIGN KEY ("A") REFERENCES "competence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_competenceTorncp_bcc" ADD CONSTRAINT "_competenceTorncp_bcc_B_fkey" FOREIGN KEY ("B") REFERENCES "rncp_bcc"("id") ON DELETE CASCADE ON UPDATE CASCADE;
