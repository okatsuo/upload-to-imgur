/*
  Warnings:

  - You are about to drop the column `imgurDetails` on the `Images` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "ImagesImgurDetail" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "detail" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    CONSTRAINT "ImagesImgurDetail_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Images" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Images" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "link" TEXT NOT NULL,
    "deletehash" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_Images" ("created_at", "deletehash", "description", "id", "link", "title", "updated_at") SELECT "created_at", "deletehash", "description", "id", "link", "title", "updated_at" FROM "Images";
DROP TABLE "Images";
ALTER TABLE "new_Images" RENAME TO "Images";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "ImagesImgurDetail_imageId_key" ON "ImagesImgurDetail"("imageId");
