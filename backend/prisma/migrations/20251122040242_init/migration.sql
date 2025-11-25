-- CreateTable
CREATE TABLE "Prestamo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isbn" TEXT NOT NULL,
    "identificacionUsuario" TEXT NOT NULL,
    "tipoUsuario" INTEGER NOT NULL,
    "fechaMaximaDevolucion" DATETIME NOT NULL
);
