-- CreateTable
CREATE TABLE "application_parameter" (
    "id" SERIAL NOT NULL,
    "home_page_content" TEXT NOT NULL,
    "application_name" VARCHAR(255) NOT NULL,

    CONSTRAINT "application_parameter_pkey" PRIMARY KEY ("id")
);
