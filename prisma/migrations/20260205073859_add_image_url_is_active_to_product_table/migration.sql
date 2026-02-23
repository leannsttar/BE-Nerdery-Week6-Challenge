-- AlterTable
ALTER TABLE "public"."products" ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;
