/*
  Warnings:

  - You are about to drop the column `nome` on the `Schedule` table. All the data in the column will be lost.
  - Added the required column `name` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Schedule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "date" DATETIME NOT NULL
);
INSERT INTO "new_Schedule" ("date", "id", "phone") SELECT "date", "id", "phone" FROM "Schedule";
DROP TABLE "Schedule";
ALTER TABLE "new_Schedule" RENAME TO "Schedule";
CREATE TABLE "new_Users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar_url" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Users" ("avatar_url", "email", "id", "password") SELECT "avatar_url", "email", "id", "password" FROM "Users";
DROP TABLE "Users";
ALTER TABLE "new_Users" RENAME TO "Users";
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
