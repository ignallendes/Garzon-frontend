import { useState } from 'react'
import { apiClient } from '../../api/apiClient'
import './salon-form.css'

function SalonForm({ onSalonCreated }) {
  const [nombre, setNombre] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nombreNormalizado = nombre.trim()

    if (!nombreNormalizado) {
      setError('Ingresa un nombre para el salón.')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      const { data } = await apiClient.post('/salones', { nombre: nombreNormalizado })
      setNombre('')
      onSalonCreated?.(data)
    } catch {
      setError('No fue posible crear el salón. Inténtalo nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="salon-form" onSubmit={handleSubmit} noValidate>
      <div className="salon-form__field">
        <label htmlFor="salon-nombre">Nombre del salón</label>
        <input
          id="salon-nombre"
          name="nombre"
          type="text"
          value={nombre}
          onChange={(event) => setNombre(event.target.value)}
          disabled={isSubmitting}
          placeholder="Ej.: Terraza"
        />
      </div>

      {error && <p className="salon-form__error" role="alert">{error}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : 'Crear salón'}
      </button>
    </form>
  )
}

export default SalonForm
