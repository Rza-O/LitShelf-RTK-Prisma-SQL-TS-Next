/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `coverImageId` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Category` table. All the data in the column will be lost.
  - Added the required column `isbn` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Author" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "bio" TEXT
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Book" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "isbn" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "website" TEXT,
    "publishedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    CONSTRAINT "Book_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Book_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Book" ("authorId", "categoryId", "description", "id", "title") SELECT "authorId", "categoryId", "description", "id", "title" FROM "Book";
DROP TABLE "Book";
ALTER TABLE "new_Book" RENAME TO "Book";
CREATE UNIQUE INDEX "Book_isbn_key" ON "Book"("isbn");
CREATE TABLE "new_Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Category" ("id") SELECT "id" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
CREATE TABLE "new_Image" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    CONSTRAINT "Image_id_fkey" FOREIGN KEY ("id") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("id", "url") SELECT "id", "url" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
