const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
app.use(express.json());

async function logDeletion(entityName, id) {
  await prisma.auditoria.create({
    data: {
      Entidad: entityName,
      Detalle: `ELIMINO EL ELEMENTO CON ID (${id}) EN LA ENTIDAD (${entityName})`,
      IdAuditado: parseInt(id),
      estado: 'Activo',
    },
  });
}

app.delete('/idioma/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const idioma = await prisma.idioma.update({
      where: { Id: parseInt(id) },
      data: { estado: 'Eliminado' },
    });
    await logDeletion('Idioma', id);
    res.json(idioma);
  } catch (error) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Idioma no encontrado' });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});

app.delete('/palabra/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const palabra = await prisma.palabra.update({
      where: { Id: parseInt(id) },
      data: { estado: 'Eliminado' },
    });
    await logDeletion('Palabra', id);
    res.json(palabra);
  } catch (error) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Palabra no encontrada' });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});

app.delete('/registro/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const registro = await prisma.registro.update({
      where: { Id: parseInt(id) },
      data: { estado: 'Eliminado' },
    });
    await logDeletion('Registro', id);
    res.json(registro);
  } catch (error) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Registro no encontrado' });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});

app.get('/auditorias', async (req, res) => {
  try {
    const auditorias = await prisma.auditoria.findMany();
    res.json(auditorias);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// CRUD para Registro
app.post('/registros', async (req, res) => {
  const { IdiomaId, PalabraId, Deletreo, Silabas, Fonetica, estado } = req.body;
  const newRegistro = await prisma.registro.create({
    data: { IdiomaId, PalabraId, Deletreo, Silabas, Fonetica, estado },
  });
  res.json(newRegistro);
});

app.get('/registros', async (req, res) => {
  const registros = await prisma.registro.findMany();
  res.json(registros);
});

app.put('/registros/:id', async (req, res) => {
  const { id } = req.params;
  const { IdiomaId, PalabraId, Deletreo, Silabas, Fonetica, estado } = req.body;
  const updatedRegistro = await prisma.registro.update({
    where: { Id: parseInt(id) },
    data: { IdiomaId, PalabraId, Deletreo, Silabas, Fonetica, estado },
  });
  res.json(updatedRegistro);
});




// CRUD para Palabra
app.post('/palabras', async (req, res) => {
  const { Palabra, Deletreo, estado } = req.body;
  const newPalabra = await prisma.palabra.create({
    data: { Palabra, Deletreo, estado },
  });
  res.json(newPalabra);
});

app.get('/palabras', async (req, res) => {
  const palabras = await prisma.palabra.findMany();
  res.json(palabras);
});

app.put('/palabras/:id', async (req, res) => {
  const { id } = req.params;
  const { Palabra, Deletreo, estado } = req.body;
  const updatedPalabra = await prisma.palabra.update({
    where: { Id: parseInt(id) },
    data: { Palabra, Deletreo, estado },
  });
  res.json(updatedPalabra);
});




// CRUD para Idioma
app.post('/idiomas', async (req, res) => {
  const { Descripcion, estado } = req.body;
  const newIdioma = await prisma.idioma.create({
    data: { Descripcion, estado },
  });
  res.json(newIdioma);
});

app.get('/idiomas', async (req, res) => {
  const idiomas = await prisma.idioma.findMany();
  res.json(idiomas);
});

app.put('/idiomas/:id', async (req, res) => {
  const { id } = req.params;
  const { Descripcion, estado } = req.body;
  const updatedIdioma = await prisma.idioma.update({
    where: { Id: parseInt(id) },
    data: { Descripcion, estado },
  });
  res.json(updatedIdioma);
});




// Eliminar físicamente un registro de Auditoria y reactivar el elemento correspondiente en la entidad de origen
async function eliminarAuditoriaYReactivarElemento(idAuditoria) {
  const auditoria = await prisma.auditoria.findUnique({
    where: { Id: idAuditoria },
  });

  if (!auditoria) {
    throw new Error('Registro de auditoría no encontrado');
  }

  const entidadOrigen = auditoria.Entidad;
  const idAuditado = auditoria.IdAuditado;

  // Eliminar físicamente el registro de auditoría
  await prisma.auditoria.delete({
    where: { Id: idAuditoria },
  });

  // Reactivar el elemento correspondiente en la entidad de origen
  await prisma[entidadOrigen].update({
    where: { Id: idAuditado },
    data: { estado: 'Activo' },
  });
}

// Ruta para eliminar un registro de Auditoria y reactivar el elemento correspondiente
app.delete('/auditoria/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await eliminarAuditoriaYReactivarElemento(parseInt(id));
    res.status(204).end(); // 204 No Content: la solicitud se ha procesado correctamente pero no hay contenido para devolver
  } catch (error) {
    console.error('Error al eliminar registro de auditoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// Ruta para recuperar una auditoría eliminada cambiando su estado a "activo"
app.put('/auditoria/recuperar/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const auditoriaRecuperada = await prisma.auditoria.update({
      where: { Id: parseInt(id) },
      data: { estado: 'Activo' },
    });
    res.json({ auditoriaRecuperada });
  } catch (error) {
    console.error('Error al recuperar registro de auditoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
