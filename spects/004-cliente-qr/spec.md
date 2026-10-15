# Feature Specification: Interfaz Móvil del Cliente (Escáner QR)

**Feature ID**: 004-cliente-qr  
**Estado**: Draft  

## 1. Contexto y Objetivo
Proporcionar una vista web pública, liviana y accesible a la que el cliente llega tras escanear el código QR impreso en su mesa (`/qr/:qr_token`). Permite al comensal consultar los datos de la mesa en la que se encuentra sentado y generar alertas directas al personal (Llamar Garzón o Pedir la Cuenta).

## 2. Requerimientos Funcionales

### RF-01: Identificación de la Mesa por Token (`GET /api/mesas/qr/:qr_token`)
- Al cargar la ruta `/qr/:qr_token`, consultar el backend sin exigir autenticación JWT.
- Mostrar en pantalla el número de mesa y el salón al que pertenece (ej: "Mesa 5 - Terraza").
- En caso de token inválido o inexistente, mostrar una pantalla de error clara.

### RF-02: Generación de Solicitudes
- Renderizar dos botones de interacción directa:
  - 🔔 **Llamar al Garzón**: Cambia el estado de la mesa a `Solicitud`.
  - 💳 **Pedir la Cuenta**: Cambia el estado de la mesa a `Cuenta`.
- Enviar la petición HTTP `PATCH /api/mesas/:id/estado` con el nuevo estado.

### RF-03: Retroalimentación al Cliente
- Tras presionar un botón, deshabilitarlo temporalmente y mostrar un mensaje de confirmación visual ("¡El garzón va en camino!" o "Generando cuenta...").

## 3. Requerimientos No Funcionales & Arquitectura
- **Pública**: No requiere login ni token JWT en el localStorage.
- **Rendimiento Móvil**: Carga ultra rápida en redes móviles 3G/4G con tamaño de JS mínimo.
- **Estructura de Componentes**:
  - Vista principal: `src/views/cliente-qr/cliente-qr.jsx` + `cliente-qr.css`
  - Componentes aislados:
    - `src/components/solicitud-button/solicitud-button.jsx` + `solicitud-button.css`