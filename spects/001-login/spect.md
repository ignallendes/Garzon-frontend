# Feature Specification: Módulo de Login (Autenticación)

**Feature ID**: 001-login  
**Estado**: Draft  

## 1. Contexto y Objetivo
Permitir al personal del restaurante (Admin, Caja, Garzón) iniciar sesión con sus credenciales mediante el backend Node.js (`POST /api/auth/login`), almacenar el JWT devuelto en `localStorage` y redirigir al Dashboard de Mesas.

## 2. Requerimientos Funcionales

### RF-01: Componente de Formulario de Login (`login-form`)
- Capturar los campos `email`/`usuario` y `password`.
- Manejar el estado local de los inputs (`useState`).
- Validar que los campos no estén vacíos antes de enviar.
- Mostrar estado visual de carga ("Cargando...") al presionar el botón de envío.

### RF-02: Consumo de API y Manejo de Respuestas
- Enviar credenciales a `POST /api/auth/login`.
- **En caso de éxito (HTTP 200)**: Guardar el `token` y los datos del usuario en `localStorage`.
- **En caso de error (HTTP 400/401)**: Mostrar un mensaje claro de error ("Credenciales inválidas") sin borrar la pantalla.

### RF-03: Redirección
- Redirigir automáticamente a `/dashboard` al autenticarse correctamente.
- Si el usuario ya cuenta con un token válido en `localStorage`, la ruta `/login` debe redirigir automáticamente a `/dashboard`.

## 3. Requerimientos No Funcionales & Arquitectura
- **Estructura de Componentes**:
  - Vista principal: `src/views/login/login.jsx` + `src/views/login/login.css`
  - Componente del formulario: `src/components/login-form/login-form.jsx` + `src/components/login-form/login-form.css`
- **Disciplina de Estado**: Todo el manejo del formulario debe ser estado local (`useState`). Solamente el estado final del usuario autenticado interactúa con el almacenamiento persistente (`localStorage`).