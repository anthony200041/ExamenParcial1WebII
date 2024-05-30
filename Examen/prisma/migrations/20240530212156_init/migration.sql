-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('Activo', 'Pendiente', 'Eliminado');

-- CreateTable
CREATE TABLE "Idioma" (
    "Id" SERIAL NOT NULL,
    "Descripcion" TEXT NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'Activo',

    CONSTRAINT "Idioma_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Palabra" (
    "Id" SERIAL NOT NULL,
    "Palabra" TEXT NOT NULL,
    "Deletreo" TEXT NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'Activo',

    CONSTRAINT "Palabra_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Registro" (
    "Id" SERIAL NOT NULL,
    "IdiomaId" INTEGER NOT NULL,
    "PalabraId" INTEGER NOT NULL,
    "Deletreo" TEXT NOT NULL,
    "Silabas" TEXT,
    "Fonetica" TEXT,
    "estado" "Estado" NOT NULL DEFAULT 'Activo',

    CONSTRAINT "Registro_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Auditoria" (
    "Id" SERIAL NOT NULL,
    "Entidad" TEXT NOT NULL,
    "Detalle" TEXT NOT NULL,
    "Fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "IdAuditado" INTEGER NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'Activo',

    CONSTRAINT "Auditoria_pkey" PRIMARY KEY ("Id")
);

-- AddForeignKey
ALTER TABLE "Registro" ADD CONSTRAINT "Registro_IdiomaId_fkey" FOREIGN KEY ("IdiomaId") REFERENCES "Idioma"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registro" ADD CONSTRAINT "Registro_PalabraId_fkey" FOREIGN KEY ("PalabraId") REFERENCES "Palabra"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
