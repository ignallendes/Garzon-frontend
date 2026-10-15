# Technical Plan: Módulo de Login (Autenticación)

## Arquitectura de Archivos a Crear

```text
src/
├── api/
│   └── apiClient.js              <-- Cliente Axios con Interceptor JWT
├── components/
│   └── login-form/
│       ├── login-form.jsx        <-- Formulario aislado (Estado local)
│       └── login-form.css        <-- Estilos específicos del formulario
└── views/
    └── login/
        ├── login.jsx             <-- Vista contenedor de Login
        └── login.css             <-- Estilos de maquetación y fondo