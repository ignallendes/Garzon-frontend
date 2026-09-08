import { useState } from 'react'
import { apiClient } from '../../api/apiClient'
import './mesa-action-modal.css'

const estadosManuales = ['Libre', 'Ocupada']

function MesaActionModal({ mesa, onClose, onEstadoActualizado }) {
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!mesa) {
    return null
  }

  // 💡 Soporte unificado para _id (MongoDB) y id
  const mesaId = mesa._id ?? mesa.id

  const handleEstadoChange = async (estado) => {
    setError('')
    setIsSubmitting(true)

    try {
      // Usamos mesaId que garantiza el _id de MongoDB
      const { data } = await apiClient.patch(`/mesas/${mesaId}/estado`, { estado })
      
      const mesaActualizada = { ...mesa, ...data, estado: data?.estado ?? estado }
      onEstadoActualizado?.(mesaActualizada)
      onClose?.()
    } catch (err) {
      console.error('Error al actualizar estado:', err)
      setError('No fue posible actualizar el estado de la mesa.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mesa-action-modal" role="presentation" onMouseDown={onClose}>
      <section
        className="mesa-action-modal__content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mesa-action-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mesa-action-modal__header">
          <h2 id="mesa-action-title">Mesa {mesa.numeroMesa ?? mesa.numero}</h2>
          <button
            className="mesa-action-modal__close"
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        <p>Selecciona el nuevo estado de la mesa.</p>

        <div className="mesa-action-modal__actions">
          {estadosManuales.map((estado) => (
            <button
              key={estado}
              type="button"
              onClick={() => handleEstadoChange(estado)}
              disabled={isSubmitting || mesa.estado === estado}
            >
              {estado}
            </button>
          ))}
        </div>

        {error && <p className="mesa-action-modal__error" role="alert">{error}</p>}
      </section>
    </div>
  )
}

export default MesaActionModal