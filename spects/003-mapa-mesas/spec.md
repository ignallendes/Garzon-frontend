# Feature Specification: Mapa de Mesas y Operación en Tiempo Real

**Feature ID**: 003-mapa-mesas  
**Estado**: Draft  

## 1. Contexto y Objetivo
Ofrecer una interfaz interactiva y optimizada para pantallas táctiles (tablets de caja, teléfonos móviles de garzones) que muestre en tiempo real la disposición de salones y el estado operativo de cada mesa. Permite atender alertas del cliente (llamados/cuenta) y cambiar manualmente los estados de las mesas.

## 2. Requerimientos Funcionales

### RF-01: Selección de Salones (`salon-selector`)
- Pestañas o selector desplegable para alternar entre los salones existentes (`GET /api/salones`).
- Cargar las mesas del salón seleccionado (`GET /api/mesas/salon/:salonId`).

### RF-02: Grilla y Código de Colores por Estado (`mesa-card`)
- Representar cada mesa con una tarjeta legible a distancia que muestre su número y su estado visual:
  - 🟩 **Libre**: Verde (`#28a745`)
  - 🟥 **Ocupada**: Rojo (`#dc3545`)
  - 🟨 **Solicitud**: Amarillo / Parpadeante (`#ffc107` - Llamado de garzón)
  - 🟦 **Cuenta**: Azul / Parpadeante (`#17a2b8` - Solicitud de la cuenta)

### RF-03: Sincronización en Tiempo Real (`Socket.io`)
- Escuchar el evento `cambio-estado-mesa` emitido por el backend.
- Actualizar el estado del componente de la mesa afectada en pantalla sin recargar la vista ni perder el estado local de la navegación.

### RF-04: Cambio Manual de Estado (`mesa-modal`)
- Al hacer clic o toque sobre una mesa, abrir un modal con las acciones disponibles según el rol:
  - **Garzón**: Cambiar estado a `Ocupada` o `Libre` (al atender la mesa).
  - **Caja**: Mismas opciones que Garzón + opción de cerrar la mesa al cobrar.
- Realizar la petición `PATCH /api/mesas/:id/estado`.

## 3. Requerimientos No Funcionales & Arquitectura
- **Mobile-First & Touch Friendly**: Botones grandes con dimensiones mínimas de toque (48x48px).
- **Estructura de Componentes**:
  - Vista principal: `src/views/dashboard/dashboard.jsx` + `dashboard.css`
  - Componentes aislados:
    - `src/components/salon-tabs/salon-tabs.jsx` + `salon-tabs.css`
    - `src/components/mesa-card/mesa-card.jsx` + `mesa-card.css`
    - `src/components/mesa-action-modal/mesa-action-modal.jsx` + `mesa-action-modal.css`