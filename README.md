# Sistema de Gestión de Biblioteca

Sistema completo para la gestión de préstamos de biblioteca desarrollado con NestJS y React. Permite administrar usuarios, libros y préstamos con una interfaz web moderna.

## Estructura del Proyecto

El proyecto está dividido en dos partes principales:

- **Backend**: API RESTful desarrollada con NestJS, TypeScript y Prisma ORM
- **Frontend**: Aplicación web React con Vite y TypeScript

## Inicio Rápido

### Prerrequisitos

- Node.js 18 o superior
- npm
- Git

### Instalación y Ejecución

**1. Clonar el repositorio:**

```bash
git clone https://github.com/Ambrusecoding/biblioteca-prestamos.git
cd biblioteca-prestamos
```

**2. Configurar y ejecutar el Backend:**

```bash
cd backend
npm install --legacy-peer-deps

# Crear archivo .env con:
# DATABASE_URL="file:./dev.db"
# PORT=3000

npx prisma generate
npx prisma migrate dev
npm run start:dev
```

El backend estará disponible en `http://localhost:3000`
Documentación Swagger: `http://localhost:3000/api/docs`

**3. Configurar y ejecutar el Frontend:**

En una nueva terminal:

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## Características Principales

- Gestión completa de usuarios, libros y préstamos
- Creación de usuarios y libros desde la interfaz web
- Sistema de préstamos con cálculo automático de fechas de devolución
- Validación de reglas de negocio (usuarios invitados con límite de préstamos)
- Interfaz responsive con diseño moderno
- API documentada con Swagger
- Pruebas unitarias completas

## Documentación

Para más detalles sobre cada parte del proyecto:

- [Documentación del Backend](./backend/README.md)
- [Documentación del Frontend](./frontend/README.md)
- [Diagrama Entidad-Relación](./backend/DIAGRAMA-ER.md)

## Tecnologías Utilizadas

**Backend:**
- NestJS
- TypeScript
- Prisma ORM
- SQLite
- Swagger/OpenAPI
- Jest

**Frontend:**
- React 19
- Vite
- TypeScript
- React Router
- Atomic Design

## Arquitectura

El proyecto sigue principios de Clean Code y SOLID, con una arquitectura en capas que separa claramente las responsabilidades:

- **Controllers**: Manejan las peticiones HTTP
- **Services**: Contienen la lógica de negocio
- **Repositories**: Gestionan el acceso a datos
- **DTOs**: Validación y transferencia de datos

## Testing

El backend incluye más de 60 pruebas unitarias que cubren controllers, services y repositories. Para ejecutarlas:

```bash
cd backend
npm test
```

## Licencia

Este proyecto es privado y está destinado para uso educativo y de evaluación técnica.

