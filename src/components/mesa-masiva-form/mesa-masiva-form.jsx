import { useState } from 'react'
import { apiClient } from '../../api/apiClient'
import './mesa-masiva-form.css'

function MesaMasivaForm({ salones = [], onMesasCreated }) {
  const [salonId, setSalonId] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const cantidadNumerica = Number(cantidad)

    if (!salonId) {
      setError('Selecciona un salón.')
      return
    }

    if (!Number.isInteger(cantidadNumerica) || cantidadNumerica < 1) {
      setError('La cantidad debe ser un número entero mayor que cero.')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      const { data } = await apiClient.post('/mesas', {
        salonId,
        cantidad: cantidadNumerica,
      })
      setCantidad('')
      onMesasCreated?.(data)
    } catch {
      setError('No fue posible crear las mesas. Inténtalo nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="mesa-masiva-form" onSubmit={handleSubmit} noValidate>
      <div className="mesa-masiva-form__field">
        <label htmlFor="mesa-salon">Salón</label>
        <select
          id="mesa-salon"
          name="salonId"
          value={salonId}
          onChange={(event) => setSalonId(event.target.value)}
          disabled={isSubmitting || salones.length === 0}
        >
          <option value="">
            {salones.length ? 'Selecciona un salón' : 'No hay salones disponibles'}
          </option>
          {salones.map((salon) => (
            <option key={salon.id} value={salon.id}>
              {salon.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="mesa-masiva-form__field">
        <label htmlFor="mesa-cantidad">Cantidad de mesas</label>
        <input
          id="mesa-cantidad"
          name="cantidad"
          type="number"
          min="1"
          step="1"
          inputMode="numeric"
          value={cantidad}
          onChange={(event) => setCantidad(event.target.value)}
          disabled={isSubmitting}
        />
      </div>

      {error && <p className="mesa-masiva-form__error" role="alert">{error}</p>}

      <button type="submit" disabled={isSubmitting || salones.length === 0}>
        {isSubmitting ? 'Guardando...' : 'Crear mesas'}
      </button>
    </form>
  )
}

export default MesaMasivaForm
