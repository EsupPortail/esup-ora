-- CreateTable
CREATE TABLE "users_socket_connected" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "socket_id" VARCHAR(255) NOT NULL,
    "refresh_asked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_socket_connected_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_screens" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(255) NOT NULL,

    CONSTRAINT "application_screens_pkey" PRIMARY KEY ("id")
);
