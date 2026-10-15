import { useState } from 'react'
import { apiClient } from '../../api/apiClient'
import './mesa-masiva-form.css'

function MesaMasivaForm({ salones = [], onMesasCreated }) {
  const [salon, setSalon] = useState('')
  const [numero, setNumero] = useState('')
  const [qrToken, setQrToken] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const numeroNumerico = Number(numero)

    if (!salon) {
      setError('Selecciona un salón.')
      return
    }

    if (!Number.isInteger(numeroNumerico) || numeroNumerico < 1) {
      setError('El número de mesa debe ser un entero mayor que cero.')
      return
    }

    if (!qrToken.trim()) {
      setError('Ingresa el token QR de la mesa.')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      const { data } = await apiClient.post('/mesas', {
        numero: numeroNumerico,
        salon,
        qr_token: qrToken.trim(),
      })
      setNumero('')
      setQrToken('')
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
          name="salon"
          value={salon}
          onChange={(event) => setSalon(event.target.value)}
          disabled={isSubmitting || salones.length === 0}
        >
          <option value="">
            {salones.length ? 'Selecciona un salón' : 'No hay salones disponibles'}
          </option>
          {salones.map((salon) => (
            <option key={salon._id ?? salon.id} value={salon._id ?? salon.id}>
              {salon.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="mesa-masiva-form__field">
        <label htmlFor="mesa-numero">Número de mesa</label>
        <input
          id="mesa-numero"
          name="numero"
          type="number"
          min="1"
          step="1"
          inputMode="numeric"
          value={numero}
          onChange={(event) => setNumero(event.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="mesa-masiva-form__field">
        <label htmlFor="mesa-qr-token">Token QR</label>
        <input
          id="mesa-qr-token"
          name="qr_token"
          type="text"
          value={qrToken}
          onChange={(event) => setQrToken(event.target.value)}
          disabled={isSubmitting}
        />
      </div>

      {error && <p className="mesa-masiva-form__error" role="alert">{error}</p>}

      <button type="submit" disabled={isSubmitting || salones.length === 0}>
        {isSubmitting ? 'Guardando...' : 'Crear mesa'}
      </button>
    </form>
  )
}

export default MesaMasivaForm
