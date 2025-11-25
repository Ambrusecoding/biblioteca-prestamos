# Biblioteca API - Sistema de Gestión de Préstamos

API RESTful desarrollada con NestJS, TypeScript y Prisma ORM. Utiliza SQLite en memoria para almacenamiento de datos.

## Características

- API RESTful con documentación Swagger
- Base de datos SQLite en memoria
- Arquitectura en capas (Controllers, Services, Repositories)
- Validación de datos con class-validator
- Pruebas unitarias (60+ tests)
- CORS configurado para frontend

## Prerrequisitos

- Node.js 18 o superior
- npm
- Git (para clonar el repositorio)

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Ambrusecoding/biblioteca-prestamos.git
cd biblioteca-prestamos/backend

# Instalar dependencias
npm install --legacy-peer-deps

# Crear archivo .env (requerido para Prisma)
# Ver sección de Variables de Entorno abajo

# Generar cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev
```

### Variables de Entorno

Crea un archivo `.env` en la raíz del backend con la siguiente configuración:

```env
DATABASE_URL="file:./dev.db"
PORT=3000
CORS_ORIGIN="http://localhost:5173,http://localhost:5174"
```

**Nota:**

- `DATABASE_URL` es requerido por Prisma. Las migraciones necesitan un archivo real, no una base de datos en memoria.
- El archivo `dev.db` se creará automáticamente y está en `.gitignore`.
- `CORS_ORIGIN` puede incluir múltiples orígenes separados por comas. En desarrollo, si no se especifica, permite cualquier puerto de `http://localhost:*`.
- Las otras variables tienen valores por defecto en el código, pero es recomendable configurarlas en el `.env`.

## Ejecución

### Desarrollo

```bash
npm run start:dev
```

La aplicación estará disponible en `http://localhost:3000`

**Nota:** La base de datos se almacena en el archivo `dev.db` en la raíz del backend.

### Producción

```bash
npm run build
npm run start:prod
```

### Testing

```bash
npm test
npm run test:cov
```

## Arquitectura

El proyecto sigue una arquitectura en capas con separación clara de responsabilidades:

```
src/
├── libro/          # Módulo de libros
├── usuario/        # Módulo de usuarios
├── prestamo/       # Módulo de préstamos
│   ├── dto/        # Data Transfer Objects
│   ├── prestamo.controller.ts
│   ├── prestamo.service.ts
│   └── prestamo.repository.ts
├── prisma/         # Configuración de Prisma
└── utils/          # Utilidades (cálculo de fechas)
```

**Controllers:** Manejan las peticiones HTTP y delegan a los servicios.

**Services:** Contienen la lógica de negocio y reglas de validación.

**Repositories:** Gestionan el acceso a la base de datos mediante Prisma.

## Base de Datos

SQLite configurado mediante `DATABASE_URL` en el archivo `.env`.

**Nota importante:** Las migraciones de Prisma requieren un archivo real de base de datos, no pueden ejecutarse en memoria. Por defecto se usa `file:./dev.db` que se crea automáticamente en la raíz del backend.

Ver el diagrama entidad-relación en [DIAGRAMA-ER.md](./DIAGRAMA-ER.md).

## API Endpoints

### Usuarios

- `GET /api/usuario` - Lista todos los usuarios

### Libros

- `GET /api/libro` - Lista todos los libros

### Préstamos

- `GET /api/prestamo` - Lista todos los préstamos
- `GET /api/prestamo/:id` - Obtiene un préstamo por ID
- `POST /api/prestamo` - Crea un nuevo préstamo

**Ejemplo de creación de préstamo:**

```bash
curl -X POST http://localhost:3000/api/prestamo \
  -H "Content-Type: application/json" \
  -d '{"isbn": "978-0-123456-78-9", "identificacionUsuario": "1234567890"}'
```

## Documentación API

Una vez iniciado el servidor, accede a la documentación Swagger en:

**http://localhost:3000/api/docs**

## Reglas de Negocio

- Los usuarios deben existir en la base de datos antes de crear un préstamo
- Usuarios tipo 3 (Invitado) solo pueden tener 1 préstamo activo
- Fechas de devolución se calculan en días hábiles (excluye fines de semana):
  - Afiliado (1): 10 días
  - Empleado (2): 8 días
  - Invitado (3): 7 días

## Testing

El proyecto incluye 60+ pruebas unitarias que cubren controllers, services y repositories.

```bash
npm test              # Ejecutar todos los tests
npm run test:watch    # Modo watch
npm run test:cov      # Con cobertura
```

Las pruebas cubren casos de éxito, validaciones de negocio y manejo de errores.

## Scripts Disponibles

- `npm run start:dev` - Desarrollo con hot-reload
- `npm run build` - Compilar para producción
- `npm run start:prod` - Ejecutar versión compilada
- `npm test` - Ejecutar pruebas
- `npm run lint` - Linter
- `npm run format` - Formatear código

## Tecnologías

- NestJS
- TypeScript
- Prisma ORM
- SQLite (en memoria)
- Swagger/OpenAPI
- Jest (testing)

## Deployment

Para información detallada ver [DEPLOYMENT.md](./DEPLOYMENT.md)
