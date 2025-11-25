/*
  Warnings:

  - Added the required column `nombre_libro` to the `libro` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_libro" (
    "isbn" TEXT NOT NULL PRIMARY KEY,
    "nombre_libro" TEXT NOT NULL
);
INSERT INTO "new_libro" ("isbn") SELECT "isbn" FROM "libro";
DROP TABLE "libro";
ALTER TABLE "new_libro" RENAME TO "libro";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
