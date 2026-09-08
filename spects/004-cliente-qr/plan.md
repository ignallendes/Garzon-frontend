# Technical Plan: Interfaz Móvil del Cliente

## Arquitectura de Archivos a Crear

```text
src/
├── components/
│   └── solicitud-button/
│       ├── solicitud-button.jsx     <-- Botón táctil con animación de feedback
│       └── solicitud-button.css
└── views/
    └── cliente-qr/
        ├── cliente-qr.jsx          <-- Vista pública de interacción del cliente
        └── cliente-qr.css