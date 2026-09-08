import './mesa-card.css'

const estados = {
  libre: { className: 'mesa-card--libre', label: 'Libre' },
  ocupada: { className: 'mesa-card--ocupada', label: 'Ocupada' },
  solicitud: { className: 'mesa-card--solicitud', label: 'Solicitud' },
  cuenta: { className: 'mesa-card--cuenta', label: 'Cuenta' },
}

function MesaCard({ numeroMesa, estado = 'Libre', onClick }) {
  const estadoNormalizado = String(estado).toLowerCase()
  const estadoActual = estados[estadoNormalizado] ?? estados.libre

  return (
    <button
      className={`mesa-card ${estadoActual.className}`}
      type="button"
      onClick={onClick}
      aria-label={`Mesa ${numeroMesa}, estado: ${estadoActual.label}`}
    >
      <span className="mesa-card__number">Mesa {numeroMesa}</span>
      <span className="mesa-card__state">{estadoActual.label}</span>
    </button>
  )
}

export default MesaCard
