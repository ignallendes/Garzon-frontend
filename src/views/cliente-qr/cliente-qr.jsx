import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiClient } from '../../api/apiClient'
import SolicitudButton from '../../components/solicitud-button/solicitud-button'
import './cliente-qr.css'

function ClienteQr() {
  const { qr_token: qrToken } = useParams()
  const [mesa, setMesa] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrent = true

    apiClient
      .get(`/mesas/qr/${qrToken}`)
      .then(({ data }) => {
        if (isCurrent) {
          setMesa(data?.mesa ?? data)
        }
      })
      .catch(() => {
        if (isCurrent) {
          setError('No encontramos una mesa asociada a este código QR.')
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
  }, [qrToken])

  const enviarSolicitud = async (estado) => {
    const mesaId = mesa?._id ?? mesa?.id

    if (!mesaId) {
      throw new Error('La mesa no está disponible.')
    }

    const { data } = await apiClient.patch(`/mesas/${mesaId}/estado`, { estado })
    const mesaActualizada = data?.mesa ?? data
    setMesa((mesaActual) => ({
      ...mesaActual,
      ...mesaActualizada,
      estado: mesaActualizada?.estado ?? estado,
    }))
  }

  if (isLoading) {
    return <main className="cliente-qr cliente-qr--centered"><p>Cargando mesa...</p></main>
  }

  if (error || !mesa) {
    return (
      <main className="cliente-qr cliente-qr--centered">
        <section className="cliente-qr__card cliente-qr__card--error" role="alert">
          <h1>Código QR no válido</h1>
          <p>{error || 'No encontramos una mesa asociada a este código QR.'}</p>
        </section>
      </main>
    )
  }

  const numero = mesa.numero
  const nombreSalon = mesa.salon?.nombre ?? mesa.salonNombre ?? 'Salón'

  return (
    <main className="cliente-qr">
      <section className="cliente-qr__card" aria-labelledby="cliente-qr-title">
        <p className="cliente-qr__eyebrow">Estás en</p>
        <h1 id="cliente-qr-title">Mesa {numero}</h1>
        <p className="cliente-qr__salon">{nombreSalon}</p>
        <p className="cliente-qr__description">¿Necesitas algo? Estamos para ayudarte.</p>

        <div className="cliente-qr__actions">
          <SolicitudButton
            variant="call"
            confirmationMessage="¡El garzón va en camino!"
            onRequest={() => enviarSolicitud('Solicitud')}
          >
            🔔 Llamar al garzón
          </SolicitudButton>
          <SolicitudButton
            variant="bill"
            confirmationMessage="Generando cuenta..."
            onRequest={() => enviarSolicitud('Cuenta')}
          >
            💳 Pedir la cuenta
          </SolicitudButton>
        </div>
      </section>
    </main>
  )
}

export default ClienteQr
