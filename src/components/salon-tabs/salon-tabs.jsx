import './salon-tabs.css'

function SalonTabs({ salones = [], selectedSalonId, onSelectSalon }) {
  if (salones.length === 0) {
    return <p className="salon-tabs__empty">No hay salones disponibles.</p>
  }

  return (
    <div className="salon-tabs" role="tablist" aria-label="Salones">
      {salones.map((salon) => {
        const isSelected = String(salon.id) === String(selectedSalonId)

        return (
          <button
            key={salon.id}
            className={`salon-tabs__tab${isSelected ? ' salon-tabs__tab--active' : ''}`}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelectSalon?.(salon.id)}
          >
            {salon.nombre}
          </button>
        )
      })}
    </div>
  )
}

export default SalonTabs
