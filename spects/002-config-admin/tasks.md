# Implementation Tasks: Configuración Administrador

- [ ] **Task 1**: Instalar librería de renderización de QR en frontend (`npm install qrcode.react`).
- [x] **Task 2**: Crear `src/components/salon-form/` para capturar y enviar `POST /api/salones`.
- [x] **Task 3**: Crear `src/components/mesa-masiva-form/` para enviar la cantidad y `salonId` a `POST /api/mesas`.
- [x] **Task 4**: Crear `src/components/qr-card/` para dibujar el código QR del token y el número de mesa.
- [x] **Task 5**: Implementar `src/views/config-admin/` orquestando los formularios y la grilla de impresión de QRs.
- [ ] **Task 6**: Añadir estilos `@media print` a `qr-card.css` para ocultar la navegación e imprimir únicamente las tarjetas de QR seleccionadas.
- [ ] **Task 7**: Probar la creación de un salón, creación masiva de 10 mesas y previsualización de impresión.
