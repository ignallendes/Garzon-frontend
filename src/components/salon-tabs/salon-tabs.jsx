import './salon-tabs.css'

function SalonTabs({ salones = [], selectedSalonId, alertasSalonIds = [], onSelectSalon }) {
  if (salones.length === 0) {
    return <p className="salon-tabs__empty">No hay salones disponibles.</p>
  }

  return (
    <div className="salon-tabs" role="tablist" aria-label="Salones">
      {salones.map((salon) => {
        // Soporte unificado para _id (MongoDB) y id
        const salonId = salon._id ?? salon.id
        const isSelected = String(salonId) === String(selectedSalonId)
        const tieneAlerta = alertasSalonIds.includes(String(salonId))

        return (
          <button
            key={salonId}
            className={`salon-tabs__tab${isSelected ? ' salon-tabs__tab--active' : ''}${tieneAlerta ? ' parpadeo-alerta' : ''}`}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelectSalon?.(salonId)}
          >
            {salon.nombre}
          </button>
        )
      })}
    </div>
  )
}

export default SalonTabs
