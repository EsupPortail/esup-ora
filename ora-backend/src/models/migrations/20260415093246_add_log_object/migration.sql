-- CreateTable
CREATE TABLE "log" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,
    "userEmail" TEXT,
    "action" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "payload" JSONB,
    "changes" JSONB,
    "statusCode" INTEGER,

    CONSTRAINT "log_pkey" PRIMARY KEY ("id")
);
