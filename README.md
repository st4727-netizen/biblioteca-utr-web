# Sistema de Control de Biblioteca Universitaria UTR

Aplicación web para la gestión de una biblioteca universitaria. Permite a los estudiantes consultar el catálogo de libros, solicitar préstamos y revisar su historial. Los administradores pueden gestionar libros, usuarios y devoluciones.

## Tecnologías utilizadas

- React
- Vite
- JavaScript
- React Router DOM
- CSS
- API REST
- Git y GitHub

## Requisitos previos

- Node.js y npm.
- Acceso a la API del proyecto.
- Token de aplicación proporcionado para consumir la API.

## Instalación

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/st4727-netizen/biblioteca-utr-web.git
   ```

2. Entrar al directorio:

   ```bash
   cd biblioteca-utr-web
   ```

3. Instalar dependencias:

   ```bash
   npm install
   ```

4. Crear un archivo `.env` en la raíz del proyecto, tomando como referencia `.env.example`.

5. Configurar las variables:

   ```env
   VITE_API_URL=https://proyecto-idgs9-v1.onrender.com
   VITE_API_APP_TOKEN=TU_TOKEN_DE_APLICACION
   ```

   Sustituir el valor de ejemplo por el token de aplicación correspondiente. No publicar ni compartir el archivo `.env`.

## Ejecución en desarrollo

```bash
npm run dev
```

Vite mostrará la dirección local para abrir la aplicación en el navegador.

## Compilación de producción

```bash
npm run build
```

Para ejecutar una vista previa de la compilación:

```bash
npm run preview
```

## Funcionalidades

### Estudiantes (USER)

- Registro e inicio de sesión.
- Consulta del catálogo de libros.
- Búsqueda de libros.
- Solicitud de préstamos.
- Consulta de préstamos personales.
- Cierre de sesión.

### Administradores (ADMIN)

- Acceso al dashboard administrativo.
- Registro y edición de libros.
- Consulta y gestión de préstamos.
- Registro de devoluciones.
- Consulta y administración de usuarios.
- Actualización de roles y estados de usuarios.

## Seguridad y autenticación

La aplicación utiliza dos mecanismos de autenticación para consumir la API:

- `x-api-token`: identifica a la aplicación cliente.
- `Authorization: Bearer`: envía el JWT correspondiente al usuario autenticado.

Las rutas están protegidas según el rol del usuario. Las respuestas HTTP 401 indican una sesión no válida o ausente; las respuestas HTTP 403 indican que el usuario no tiene permisos para realizar la operación.

La sesión del usuario se conserva mediante `localStorage`.

## API

- URL base: https://proyecto-idgs9-v1.onrender.com
- Documentación Swagger: https://proyecto-idgs9-v1.onrender.com/api/docs/

Principales grupos de endpoints:

- `/api/auth`: registro, inicio de sesión y consulta del usuario autenticado.
- `/api/users`: consulta y administración de usuarios.
- `/api/books`: consulta y administración de libros.
- `/api/loans/books`: consulta y gestión de préstamos.

Las operaciones administrativas requieren los permisos correspondientes.

## Variables de entorno

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | Dirección base de la API REST. |
| `VITE_API_APP_TOKEN` | Token de aplicación para consumir la API. |

El archivo `.env.example` contiene los nombres de las variables necesarias, sin incluir credenciales reales.

## Control de versiones

El desarrollo utiliza Git y GitHub, con una organización de ramas basada en GitFlow:

- `main`: versión estable.
- `develop`: integración de funcionalidades.
- `feature/*`: desarrollo de nuevas funcionalidades.
- `fix/*`: corrección de errores.

Los cambios se organizan mediante commits descriptivos y Pull Requests.

## Despliegue

La aplicación está preparada para compilarse para producción mediante Vite. El despliegue público se realizará en Vercel.

Se deberán configurar las variables `VITE_API_URL` y `VITE_API_APP_TOKEN` en el panel de Vercel antes de generar el despliegue.

## Proyecto académico

**Universidad Tecnológica El Retoño (UTR)**
Ingeniería en Desarrollo y Gestión de Software
Proyecto integrador: Sistema de Control de Biblioteca Universitaria
**Repositorio:** https://github.com/st4727-netizen/biblioteca-utr-web