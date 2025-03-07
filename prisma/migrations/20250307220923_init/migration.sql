-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "coverImageId" TEXT,
    "authorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Book_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Book_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "Image" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Book_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "bookId" TEXT NOT NULL,
    CONSTRAINT "Review_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Book_categoryId_key" ON "Book"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Book_coverImageId_key" ON "Book"("coverImageId");
