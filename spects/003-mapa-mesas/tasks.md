# Implementation Tasks: Mapa de Mesas y Tiempo Real

- [x] **Task 1**: Crear `src/api/socketClient.js` para inicializar y gestionar la conexión de `socket.io-client`.
- [x] **Task 2**: Crear `src/components/salon-tabs/` para listar y seleccionar los salones disponibles.
- [x] **Task 3**: Crear `src/components/mesa-card/` aplicando estilos dinámicos de color según el estado (`Libre`, `Ocupada`, `Solicitud`, `Cuenta`).
- [x] **Task 4**: Crear `src/components/mesa-action-modal/` con opciones para actualizar el estado (`PATCH /api/mesas/:id/estado`).
- [x] **Task 5**: Crear `src/views/dashboard/` conectando la carga por HTTP (`apiClient`) y la escucha activa de WebSockets (`socketClient`).
- [ ] **Task 6**: Probar el cambio de estado simulando una actualización desde Postman/Backend y verificar que la tarjeta en el frontend cambie de color automáticamente.
