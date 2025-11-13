-- CreateTable
CREATE TABLE "information_bubble" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "screen" VARCHAR(255) NOT NULL,

    CONSTRAINT "information_bubble_pkey" PRIMARY KEY ("id")
);
