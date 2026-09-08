# Garzon-frontend Constitution

## Core Principles

### I. Component-First & Modular Architecture
El desarrollo debe ser modular y desacoplado de la API. Cada vista o componente visual (Mesa, Salón, Alert, Modal) debe poder testearse de forma aislada. La lógica de estado global (Socket.io, Auth JWT) debe residir en hooks personalizados (`useSocket`, `useAuth`, `useMesas`) y ser agnóstica de la capa UI.

### II. Real-time Synchronization & Resilience
El estado visual de las mesas y solicitudes debe reflejar con la menor latencia posible las emisiones de WebSockets del Backend (`cambio-estado-mesa`). Si la conexión por WebSockets falla o sufre una desconexión, el sistema debe implementar una reconexión automática transparente y degradar elegantemente a HTTP Polling sin bloquear la interfaz del camarero/cajero.

### III. Test-Driven Development (TDD)
Cualquier nuevo componente crítico (ej. renderizador de mapa de mesas, interceptor de autenticación, manejador de eventos de Socket) debe contar con tests unitarios y de integración (con React Testing Library / Vitest) antes de dar por completada la especificación del requerimiento.

### IV. Single Source of Truth for Auth & Real-Time Data
El token JWT debe almacenarse exclusivamente en `localStorage` con interceptores centralizados en Axios/Fetch. El estado del salón y sus mesas debe residir en un contexto/store unificado para evitar desincronizaciones entre componentes hermanos (como el panel lateral de solicitudes y la grilla de mesas).

### V. Simplicity & Performance (Mobile-First / Fast-Scan)
La interfaz está diseñada para un entorno operativo de restaurante (pantallas táctiles de mozos, tablets en caja y dispositivos móviles de clientes). La jerarquía visual, la diferenciación por colores de estado (`Libre`, `Ocupada`, `Solicitud`, `Cuenta`) y el tiempo de respuesta visual tras la interacción deben priorizar la simplicidad y la visibilidad inmediata a distancia.

## Technical Constraints & Stack

- **Framework:** React 18+ con Vite.
- **Estilos:** Tailwind CSS / CSS Modules (enfocado en alta visibilidad e interactividad rápida).
- **Comunicación HTTP:** Axios con Interceptores JWT.
- **Real-Time Client:** `socket.io-client`.
- **Enrutamiento:** React Router DOM (Manejando rutas protegidas por rol: `Admin`, `Caja`, `Garzon`).

## Development Workflow & Spec Quality Gates

1. **Spec & Feature Alignment:** Ninguna funcionalidad de la UI se implementa sin un archivo `.spec.md` previo que defina los estados de carga, error y eventos de tiempo real esperados.
2. **Contract Compliance:** Toda llamada a la API debe alinearse estrictamente con los contratos de endpoints definidos en el backend (`/api/auth`, `/api/salones`, `/api/mesas`, `/api/solicitudes`).
3. **Build & Lint Gate:** No se aprueban cambios si el comando `vite build` genera advertencias severas de bundle o si existen errores de linter en hooks de React.

## Governance

- Esta constitución rige todas las decisiones de arquitectura del proyecto `Garzon-frontend`.
- Cualquier modificación a los principios de gestión de estado global, autenticación o comunicación por WebSockets requiere actualizar esta constitución y la documentación de la especificación correspondiente.

**Version**: 1.0.0 | **Ratified**: 2026-09-07 | **Last Amended**: 2026-09-07