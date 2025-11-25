# Biblioteca Dashboard

Aplicación web React con Vite para gestionar usuarios, libros y préstamos de una biblioteca. Construida con Atomic Design y TypeScript.

## Características

- Dashboard interactivo con gestión de usuarios, libros y préstamos
- Crear préstamos desde la interfaz
- Diseño responsive
- Arquitectura Atomic Design
- TypeScript para type safety

## Prerrequisitos

- Node.js 18 o superior
- npm
- Backend API corriendo (ver [backend/README.md](../backend/README.md))

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Ambrusecoding/biblioteca-prestamos.git
cd biblioteca-prestamos/frontend

# Instalar dependencias
npm install
```

### Variables de Entorno (Opcional)

Si necesitas cambiar la URL de la API, crea un archivo `.env` en la raíz del frontend:

```env
VITE_API_BASE_URL=http://localhost:3000
```

**Nota:** Por defecto la aplicación usa `http://localhost:3000`. Las variables en Vite deben comenzar con `VITE_` para estar disponibles.

## Ejecución

### Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Producción

```bash
npm run build
npm run preview
```

## Estructura del Proyecto

```
src/
├── components/
│   ├── atoms/          # Componentes básicos (Button, Card, Badge, etc.)
│   ├── molecules/      # Componentes compuestos (Table, Modal, Input, etc.)
│   ├── organisms/      # Componentes complejos (ListaUsuarios, FormCrearPrestamo, etc.)
│   └── templates/      # Layouts (DashboardLayout)
├── pages/              # Páginas de la aplicación
├── services/           # Servicios API
├── config/             # Configuración (API endpoints)
├── types/              # Tipos TypeScript
├── App.tsx             # Componente raíz
└── main.tsx            # Punto de entrada
```

## Arquitectura Atomic Design

El proyecto sigue la metodología Atomic Design:

- **Atoms:** Componentes básicos (Button, Card, Badge, Loading, Title)
- **Molecules:** Componentes compuestos (Table, Modal, Input, SectionHeader)
- **Organisms:** Componentes complejos (ListaUsuarios, ListaLibros, ListaPrestamos, FormCrearPrestamo, Navigation)
- **Templates:** Layouts (DashboardLayout)
- **Pages:** Páginas completas (HomePage, UsuariosPage, LibrosPage, PrestamosPage)

## Funcionalidades

El dashboard muestra usuarios, libros y préstamos en una interfaz dividida en dos paneles. Desde la sección de préstamos puedes crear nuevos préstamos seleccionando un usuario y un libro.

## Configuración de API

La aplicación se conecta a la API usando `VITE_API_BASE_URL`. Por defecto usa `http://localhost:3000` si no se configura la variable de entorno.

## Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Previsualizar build de producción
- `npm run lint` - Ejecutar linter

## Tecnologías

- React 19
- Vite
- TypeScript
- React Router
- CSS Modules

## Deployment

Para información detallada ver [DEPLOYMENT.md](./DEPLOYMENT.md)
