-- AlterTable
ALTER TABLE "enseignement" ADD COLUMN "render_order" INTEGER;
UPDATE "enseignement" SET "render_order" = 0;
