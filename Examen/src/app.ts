import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here
   // Crear 3 datos de prueba
   const auditoria1 = await prisma.auditoria.create({
    data: {
      Entidad: 'Idioma',
      Detalle: 'Creación de idioma español',
      Fecha: new Date('2024-01-01'),
      IdAuditado: 1,
      estado: 'Activo',
    },
  });

  const auditoria2 = await prisma.auditoria.create({
    data: {
      Entidad: 'Palabra',
      Detalle: 'Adición de la palabra "Hola"',
      Fecha: new Date('2024-01-02'),
      IdAuditado: 2,
      estado: 'Pendiente',
    },
  });

  const auditoria3 = await prisma.auditoria.create({
    data: {
      Entidad: 'Registro',
      Detalle: 'Actualización del registro de deletreo',
      Fecha: new Date('2024-01-03'),
      IdAuditado: 3,
      estado: 'Eliminado',
    },
  });

  // Recuperar y mostrar los datos
  const auditorias = await prisma.auditoria.findMany();
console.log(auditorias);

    // Agregar registros para la entidad Idioma
    const idioma1 = await prisma.idioma.create({
        data: {
          Descripcion: 'Inglés',
          estado: 'Activo',
        },
      });
    
      const idioma2 = await prisma.idioma.create({
        data: {
          Descripcion: 'Español',
          estado: 'Activo',
        },
      });
    
      const idioma3 = await prisma.idioma.create({
        data: {
          Descripcion: 'Francés',
          estado: 'Activo',
        },
      });
    
      console.log('Registros de Idioma creados:', idioma1, idioma2, idioma3);
    
      // Agregar registros para la entidad Palabra
      const palabra1 = await prisma.palabra.create({
        data: {
          Palabra: 'hello',
          Deletreo: 'həˈloʊ',
          estado: 'Activo',
        },
      });
    
      const palabra2 = await prisma.palabra.create({
        data: {
          Palabra: 'hola',
          Deletreo: 'oˈla',
          estado: 'Activo',
        },
      });
    
      const palabra3 = await prisma.palabra.create({
        data: {
          Palabra: 'bonjour',
          Deletreo: 'bɔ̃ʒuʁ',
          estado: 'Activo',
        },
      });
    
      console.log('Registros de Palabra creados:', palabra1, palabra2, palabra3);
    
      // Agregar registros para la entidad Registro
      const registro1 = await prisma.registro.create({
        data: {
          IdiomaId: idioma1.Id,
          PalabraId: palabra1.Id,
          Deletreo: 'həˈloʊ',
          Silabas: 'he-llo',
          Fonetica: 'hɛˈloʊ',
          estado: 'Activo',
        },
      });
    
      const registro2 = await prisma.registro.create({
        data: {
          IdiomaId: idioma2.Id,
          PalabraId: palabra2.Id,
          Deletreo: 'oˈla',
          Silabas: 'ho-la',
          Fonetica: 'oˈla',
          estado: 'Activo',
        },
      });
    
      const registro3 = await prisma.registro.create({
        data: {
          IdiomaId: idioma3.Id,
          PalabraId: palabra3.Id,
          Deletreo: 'bɔ̃ʒuʁ',
          Silabas: 'bon-jour',
          Fonetica: 'bɔ̃.ʒuʁ',
          estado: 'Activo',
        },
      });
    
      console.log('Registros de Registro creados:', registro1, registro2, registro3);
  
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })