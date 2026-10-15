# Feature Specification: Configuración Administrador (Salones, Mesas y QR)

**Feature ID**: 002-config-admin  
**Estado**: Draft  

## 1. Contexto y Objetivo
Permitir únicamente a los usuarios con rol `Admin` gestionar la infraestructura física del restaurante: crear/eliminar salones, ejecutar la creación masiva de mesas asociadas a un salón y visualizar/imprimir los códigos QR de cada mesa para ser colocados físicamente en el local.

## 2. Requerimientos Funcionales

### RF-01: Gestión de Salones (`POST /api/salones`, `GET /api/salones`)
- Formulario simple para crear un nuevo salón (nombre del salón).
- Listado de salones existentes con botón para eliminar (`DELETE /api/salones/:id`).

### RF-02: Carga Masiva de Mesas (`POST /api/mesas`)
- Formulario de creación masiva seleccionando un salón existente y especificando la `cantidad` de mesas.
- Al guardar, el backend asignará automáticamente la correlatividad global del número de mesa y sus tokens QR.

### RF-03: Visualización e Impresión de Códigos QR
- Renderizar para cada mesa de un salón su correspondiente código QR generado en tiempo real basado en la URL pública: `${FRONTEND_URL}/qr/${qr_token}`.
- Botón "Imprimir QRs" que active la vista limpia de impresión (`window.print()`) o genere una cuadrícula lista para impresión en papel/adhesivo, mostrando el número de mesa y el QR.

## 3. Requerimientos No Funcionales & Arquitectura
- **Protección de Ruta**: La vista `/admin/configuracion` debe ser accesible únicamente si el usuario autenticado posee `rol === 'Admin'`.
- **Estructura de Componentes**:
  - Vista principal: `src/views/config-admin/config-admin.jsx` + `config-admin.css`
  - Componentes aislados:
    - `src/components/salon-form/salon-form.jsx` + `salon-form.css`
    - `src/components/mesa-masiva-form/mesa-masiva-form.jsx` + `mesa-masiva-form.css`
    - `src/components/qr-card/qr-card.jsx` + `qr-card.css`