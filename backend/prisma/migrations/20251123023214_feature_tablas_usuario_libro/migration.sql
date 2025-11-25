/*
  Warnings:

  - You are about to drop the `Prestamo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Prestamo";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "usuario" (
    "identificacion_usuario" TEXT NOT NULL PRIMARY KEY,
    "tipo_usuario" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "libro" (
    "isbn" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "prestamo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isbn" TEXT NOT NULL,
    "identificacion_usuario" TEXT NOT NULL,
    "fecha_prestamo" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_maxima_devolucion" DATETIME NOT NULL,
    CONSTRAINT "prestamo_isbn_fkey" FOREIGN KEY ("isbn") REFERENCES "libro" ("isbn") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "prestamo_identificacion_usuario_fkey" FOREIGN KEY ("identificacion_usuario") REFERENCES "usuario" ("identificacion_usuario") ON DELETE RESTRICT ON UPDATE CASCADE
);
