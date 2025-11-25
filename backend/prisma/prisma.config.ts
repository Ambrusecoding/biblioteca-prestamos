// Configuración de Prisma para migraciones
// En Prisma 7+, la URL se configura aquí en lugar del schema.prisma
// BASE DE DATOS EN MEMORIA: Usa file::memory: para SQLite en memoria
// La variable DATABASE_URL se lee desde .env

export default {
  datasource: {
    url: process.env.DATABASE_URL || 'file::memory:?cache=shared',
  },
};
