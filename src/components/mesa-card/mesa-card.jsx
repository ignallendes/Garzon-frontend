import './mesa-card.css'

const estados = {
  libre: { className: 'mesa-card--libre', label: 'Libre' },
  ocupada: { className: 'mesa-card--ocupada', label: 'Ocupada' },
  solicitud: { className: 'mesa-card--solicitud', label: 'Solicitud' },
  cuenta: { className: 'mesa-card--cuenta', label: 'Cuenta' },
}

function MesaCard({ numero, estado = 'Libre', solicitud, tieneAlerta = false, onClick, onAtender }) {
  const estadoNormalizado = String(estado).toLowerCase()
  const estadoActual = estados[estadoNormalizado] ?? estados.libre
  const tipoSolicitud = String(solicitud?.tipo ?? '').toLowerCase()
  const detalleSolicitud = tipoSolicitud === 'cuenta'
    ? '💳 Pide la Cuenta'
    : '🙋‍♂️ Solicita Garzón'

  return (
    <article
      className={`mesa-card ${estadoActual.className}${tieneAlerta ? ' parpadeo-alerta' : ''}`}
    >
      <button
        className="mesa-card__main"
        type="button"
        onClick={onClick}
        aria-label={`Mesa ${numero}, estado: ${estadoActual.label}`}
      >
        <span className="mesa-card__number">Mesa {numero}</span>
        <span className="mesa-card__state">{estadoActual.label}</span>
      </button>
      {solicitud && (
        <div className="mesa-card__alerta">
          <span className="mesa-card__solicitud">{detalleSolicitud}</span>
          <button
            className="mesa-card__atender"
            type="button"
            onClick={() => onAtender?.(solicitud)}
          >
            OK
          </button>
        </div>
      )}
    </article>
  )
}

export default MesaCard
