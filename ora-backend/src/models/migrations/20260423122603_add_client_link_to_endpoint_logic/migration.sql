-- CreateTable
CREATE TABLE "user_unsubscribed_notifications" (
    "id" SERIAL NOT NULL,
    "id_user" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "by_email" BOOLEAN NOT NULL DEFAULT false,
    "by_push" BOOLEAN NOT NULL DEFAULT false,
    "by_object_ids" VARCHAR(255)[],

    CONSTRAINT "user_unsubscribed_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "link_client_to_ora_endpoint" (
    "id" SERIAL NOT NULL,
    "client_id" VARCHAR(255) NOT NULL,
    "endpoint" VARCHAR(255) NOT NULL,
    "read_only" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "link_client_to_ora_endpoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "formation_id" INTEGER NOT NULL,
    "version_id" INTEGER NOT NULL,
    "object_id" INTEGER NOT NULL,
    "object_type" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "url" VARCHAR(255),
    "differentiel" JSONB,
    "is_historized" BOOLEAN NOT NULL DEFAULT false,
    "is_read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_unsubscribed_notifications_email_key" ON "user_unsubscribed_notifications"("email");
