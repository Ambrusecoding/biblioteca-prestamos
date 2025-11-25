# 🚀 Guía de Deployment - Biblioteca Dashboard

Esta guía explica cómo desplegar el Dashboard de Biblioteca (aplicación React) en diferentes plataformas.

## 📋 Índice

- [Prerrequisitos](#prerrequisitos)
- [Opciones de Deployment](#opciones-de-deployment)
- [Docker (Opcional)](#docker-opcional)
- [Platforms as a Service](#platforms-as-a-service)
  - [Vercel (Recomendado)](#vercel-recomendado)
  - [Netlify](#netlify)
  - [Render](#render)
  - [GitHub Pages](#github-pages)

## ⚙️ Prerrequisitos

- Node.js 18+ instalado
- API de biblioteca desplegada y accesible
- Git instalado

## 🐳 Docker (Opcional)

### ¿Necesitas Docker para el Frontend?

**Para desarrollo local: NO es estrictamente necesario** porque:

- Vite es muy rápido en desarrollo
- No necesitas aislar dependencias del sistema
- El hot-reload funciona perfectamente sin Docker

**Para producción: Es útil pero NO obligatorio** porque:

- Las aplicaciones React se convierten en archivos estáticos
- La mayoría de plataformas (Vercel, Netlify) manejan el build automáticamente
- Docker agrega complejidad innecesaria para SPAs estáticas

**Casos donde SÍ usar Docker para Frontend:**

- Necesitas un servidor que sirva archivos estáticos (nginx)
- Quieres consistencia total entre entornos
- Desplegas en tu propia infraestructura (VPS/Kubernetes)

## 🌐 Platforms as a Service (PaaS)

### Vercel (Recomendado)

Vercel está optimizado para aplicaciones React/Next.js y es la mejor opción.

#### Pasos:

1. **Instalar Vercel CLI** (opcional):

   ```bash
   npm i -g vercel
   ```

2. **Conectar repositorio:**

   - Ve a [vercel.com](https://vercel.com)
   - Conecta tu repositorio de GitHub
   - Vercel detectará automáticamente que es un proyecto Vite

3. **Configurar variables de entorno:**

   - `VITE_API_BASE_URL`: URL de tu API (ej: `https://api-biblioteca.railway.app`)

4. **Deploy automático:**
   - Cada push a `main` desplegará automáticamente

#### Configuración manual (`vercel.json`):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

### Netlify

1. Conecta tu repositorio de GitHub a Netlify
2. Configuración del build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Variables de entorno:
   - `VITE_API_BASE_URL`: URL de tu API
4. Deploy automático en cada push

### Render

1. Crea un nuevo "Static Site" en Render
2. Conecta tu repositorio de GitHub
3. Configuración:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Variables de entorno:
   - `VITE_API_BASE_URL`

### GitHub Pages

1. Instala `gh-pages`:

   ```bash
   npm install --save-dev gh-pages
   ```

2. Actualiza `package.json`:

   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. Configura `vite.config.ts`:

   ```typescript
   export default defineConfig({
     base: "/biblioteca-dashboard/",
     // ... resto de la config
   });
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

## 🖥️ Servidor VPS/Dedicado

### Con Nginx

1. **Construir la aplicación:**

   ```bash
   npm run build
   ```

2. **Configurar Nginx:**

   ```nginx
   server {
       listen 80;
       server_name tu-dominio.com;

       root /var/www/biblioteca-dashboard/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

3. **Copiar archivos:**
   ```bash
   sudo cp -r dist/* /var/www/biblioteca-dashboard/dist/
   ```

### Con Docker + Nginx

Si prefieres usar Docker:

1. Construir la imagen:

   ```bash
   docker build -t biblioteca-dashboard .
   ```

2. Ejecutar:
   ```bash
   docker run -p 80:80 biblioteca-dashboard
   ```

## 🔧 Variables de Entorno

Crea un archivo `.env.production`:

```env
VITE_API_BASE_URL=https://tu-api-url.com
```

⚠️ **Importante**: Las variables en Vite deben comenzar con `VITE_` para estar disponibles en el build.

## 🔄 Actualizar Configuración de API

Después de desplegar, actualiza `src/config/api.ts` o usa variables de entorno:

```typescript
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
```

## 📊 Monitoreo

Para aplicaciones React estáticas, considera:

- **Sentry** para error tracking en producción
- **Google Analytics** para métricas de uso
- **Vercel Analytics** (si usas Vercel)

## 🔒 CORS

Asegúrate de que tu API tenga configurado CORS para permitir requests desde tu dominio de producción:

```typescript
app.enableCors({
  origin: ["http://localhost:5173", "https://tu-dashboard.vercel.app"],
  // ...
});
```
