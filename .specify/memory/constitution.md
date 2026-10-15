# Garzon-frontend Constitution

## Core Principles

### I. Component-First & Single Responsibility
El desarrollo debe ser totalmente modular y basado en componentes visuales aislados. 
- **Single Responsibility:** Cada componente debe cumplir exactamente **una sola funcionalidad o responsabilidad** (ej: `LoginForm` solo maneja la captura/envío del form, `MesaCard` solo renderiza la tarjeta de una mesa).
- **Aislamiento:** Cada componente vive en su propia carpeta en minúsculas junto a su archivo de estilos dedicado.
- **Desacoplamiento:** Las vistas y componentes de UI no contienen lógica pesada de API; consumen servicios o hooks aislados.

### II. State Discipline: Local State First
El estado debe gestionarse con la mayor cercanía posible al componente que lo necesita:
- **Local State First:** Todo estado (inputs de formulario, visibilidad de modales, estados de hover/active) debe ser estrictamente local mediante `useState` o `useReducer` dentro del componente.
- **Global State Justification:** El estado global (Context/Store) **solo está permitido cuando se justifica técnicamente** para datos compartidos globalmente (autenticación JWT, usuario logueado, sincronización en vivo de eventos WebSockets). No se debe elevar estado (`lift state`) a nivel global si puede resolverse localmente o mediante composición.

### III. Real-Time Synchronization & Resilience
El estado visual de las mesas y solicitudes debe reflejar con la menor latencia posible las emisiones de WebSockets del Backend (`cambio-estado-mesa`). Si la conexión por WebSockets falla o sufre una desconexión, el sistema debe implementar una reconexión automática transparente y degradar elegantemente a HTTP Polling sin bloquear la interfaz.

### IV. Test-Driven Development (TDD)
Cualquier nuevo componente crítico (ej. renderizador de mapa de mesas, interceptor de autenticación, manejador de eventos de Socket) debe contar con tests unitarios y de integración (con Vitest / React Testing Library) antes de dar por completada la especificación del requerimiento.

### V. Simplicity & Performance (Mobile-First / Fast-Scan)
La interfaz está diseñada para un entorno operativo de restaurante (pantallas táctiles de mozos, tablets en caja y dispositivos móviles de clientes). La jerarquía visual, la diferenciación por colores de estado (`Libre`, `Ocupada`, `Solicitud`, `Cuenta`) y el tiempo de respuesta visual tras la interacción deben priorizar la simplicidad y la visibilidad inmediata a distancia.

## Component Directory Structure Standard

Cada componente debe seguir obligatoriamente este patrón de nombrado y localización en minúsculas:

```text
src/
├── components/
│   ├── mesa/
│   │   ├── mesa.jsx
│   │   └── mesa.css
│   ├── login-form/
│   │   ├── login-form.jsx
│   │   └── login-form.css
│   └── input-field/
│       ├── input-field.jsx
│       └── input-field.css
└── views/
    ├── login/
    │   ├── login.jsx
    │   └── login.css
    └── dashboard/
        ├── dashboard.jsx
        └── dashboard.css