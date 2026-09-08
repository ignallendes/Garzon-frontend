# Technical Plan: Configuración Administrador

## Librerías Adicionales Requeridas
- `qrcode.react` (o equivalente ligero) para transformar el string `qr_token` en una imagen QR canvas/SVG directamente en la interfaz.

## Arquitectura de Archivos a Crear

```text
src/
├── components/
│   ├── salon-form/
│   │   ├── salon-form.jsx         <-- Formulario de creación de salón
│   │   └── salon-form.css
│   ├── mesa-masiva-form/
│   │   ├── mesa-masiva-form.jsx   <-- Formulario masivo de mesas
│   │   └── mesa-masiva-form.css
│   └── qr-card/
│       ├── qr-card.jsx            <-- Renderizador individual de QR por mesa
│       └── qr-card.css            <-- Estilos optimizados para la vista de impresión (@media print)
└── views/
    └── config-admin/
        ├── config-admin.jsx       <-- Vista contenedora Admin
        └── config-admin.css