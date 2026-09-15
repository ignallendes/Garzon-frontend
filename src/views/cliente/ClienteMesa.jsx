import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiClient } from '../../api/apiClient'
import './cliente-mesa.css'

const REQUEST_MESSAGES = {
  Solicitada: '¡Garzón notificado! En breve te atenderán.',
  Cuenta: '¡Cuenta solicitada! En breve te la llevaremos.',
}

function ClienteMesa() {
  const { token } = useParams()
  const [mesa, setMesa] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const successTimeout = useRef(null)

  useEffect(() => {
    let isCurrent = true

    setIsLoading(true)
    setError('')
    setMesa(null)

    apiClient
      .get(`/mesas/qr/${token}`)
      .then(({ data }) => {
        if (isCurrent) {
          setMesa(data?.mesa ?? data)
        }
      })
      .catch(() => {
        if (isCurrent) {
          setError('Mesa no encontrada o código QR vencido')
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false)
        }
      })

    return () => {
      isCurrent = false
    }
  }, [token])

  useEffect(() => () => clearTimeout(successTimeout.current), [])

  const enviarSolicitud = async (tipo) => {
    setIsSending(true)
    setError('')
    setSuccessMessage('')

    try {
      await apiClient.post('/solicitudes/cliente', {
        qr_token: token,
        tipo,
      })

      setSuccessMessage(REQUEST_MESSAGES[tipo])
      clearTimeout(successTimeout.current)
      successTimeout.current = setTimeout(() => setSuccessMessage(''), 4000)
    } catch {
      setError('No pudimos enviar tu solicitud. Revisa tu conexión e inténtalo nuevamente.')
    } finally {
      setIsSending(false)
    }
  }

  if (isLoading) {
    return <main className="cliente-mesa cliente-mesa--centered"><p>Cargando mesa...</p></main>
  }

  if (error && !mesa) {
    return (
      <main className="cliente-mesa cliente-mesa--centered">
        <section className="cliente-mesa__card cliente-mesa__card--error" role="alert">
          <h1>Mesa no disponible</h1>
          <p>{error}</p>
        </section>
      </main>
    )
  }

  const numero = mesa?.numero
  const nombreSalon = mesa?.salon?.nombre ?? mesa?.salonNombre ?? mesa?.nombre_salon ?? 'Salón'

  return (
    <main className="cliente-mesa">
      <section className="cliente-mesa__card" aria-labelledby="cliente-mesa-title">
        <p className="cliente-mesa__eyebrow">Estás en</p>
        <h1 id="cliente-mesa-title">Mesa #{numero}</h1>
        <p className="cliente-mesa__salon">{nombreSalon}</p>
        <p className="cliente-mesa__description">¿Necesitas algo? Estamos para ayudarte.</p>

        <div className="cliente-mesa__actions">
          <button type="button" onClick={() => enviarSolicitud('Solicitada')} disabled={isSending}>
            🙋‍♂️ {isSending ? 'Enviando solicitud...' : 'Llamar Garzón'}
          </button>
          <button type="button" onClick={() => enviarSolicitud('Cuenta')} disabled={isSending}>
            💳 {isSending ? 'Enviando solicitud...' : 'Pedir la Cuenta'}
          </button>
        </div>

        {successMessage && <p className="cliente-mesa__message cliente-mesa__message--success" role="status">{successMessage}</p>}
        {error && <p className="cliente-mesa__message cliente-mesa__message--error" role="alert">{error}</p>}
      </section>
    </main>
  )
}

export default ClienteMesa
