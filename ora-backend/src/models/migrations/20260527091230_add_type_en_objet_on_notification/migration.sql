/*
  Warnings:

  - Added the required column `objet_id` to the `user_unsubscribed_notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `objet_type` to the `user_unsubscribed_notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_unsubscribed_notifications" ADD COLUMN     "objet_id" INTEGER NOT NULL,
ADD COLUMN     "objet_type" VARCHAR(255) NOT NULL;
