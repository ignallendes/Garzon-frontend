# Technical Plan: Mapa de Mesas y Operación en Tiempo Real

## Arquitectura de Archivos a Crear

```text
src/
├── api/
│   └── socketClient.js             <-- Conexión centralizada a Socket.io
├── components/
│   ├── salon-tabs/
│   │   ├── salon-tabs.jsx          <-- Selector de salones activo
│   │   └── salon-tabs.css
│   ├── mesa-card/
│   │   ├── mesa-card.jsx           <-- Tarjeta individual de mesa (Estado/Color)
│   │   └── mesa-card.css
│   └── mesa-action-modal/
│       ├── mesa-action-modal.jsx    <-- Modal de cambio manual de estado
│       └── mesa-action-modal.css
└── views/
    └── dashboard/
        ├── dashboard.jsx           <-- Orquestador de la vista de mesas
        └── dashboard.css