import { useEffect, useState } from 'react'
import { apiClient } from '../../api/apiClient'
import { socketClient } from '../../api/socketClient'
import MesaActionModal from '../../components/mesa-action-modal/mesa-action-modal'
import MesaCard from '../../components/mesa-card/mesa-card'
import SalonTabs from '../../components/salon-tabs/salon-tabs'
import './dashboard.css'

function Dashboard() {
  const [salones, setSalones] = useState([])
  const [selectedSalonId, setSelectedSalonId] = useState('')
  const [mesas, setMesas] = useState([])
  const [selectedMesa, setSelectedMesa] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // 1. Cargar Salones
  useEffect(() => {
    let isCurrent = true

    apiClient
      .get('/salones')
      .then(({ data }) => {
        if (!isCurrent) return

        const salonesCargados = Array.isArray(data) ? data : data.salones ?? []
        setSalones(salonesCargados)

        if (salonesCargados.length > 0) {
          // 💡 SOPORTE PARA _id (MongoDB) e id
          const idInicial = salonesCargados[0]._id ?? salonesCargados[0].id

          if (idInicial) {
            setSelectedSalonId(String(idInicial))
          } else {
            setIsLoading(false)
            setError('El salón recibido no tiene un identificador válido.')
          }
        } else {
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (isCurrent) {
          console.error(err)
          setError('No fue posible cargar los salones.')
          setIsLoading(false)
        }
      })

    return () => {
      isCurrent = false
    }
  }, [])

  // 2. Cargar Mesas por ID de Salón
  useEffect(() => {
    if (!selectedSalonId || selectedSalonId === 'undefined') return undefined

    let isCurrent = true

    // 💡 CAMBIO DE RUTA: `/mesas/${selectedSalonId}` coincide con tu endpoint de Postman
    apiClient
      .get(`/mesas/${selectedSalonId}`)
      .then(({ data }) => {
        if (isCurrent) {
          setMesas(Array.isArray(data) ? data : data.mesas ?? [])
        }
      })
      .catch((err) => {
        if (isCurrent) {
          console.error(err)
          setMesas([])
          setError('No fue posible cargar las mesas del salón.')
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
  }, [selectedSalonId])

  // 3. WebSockets
  useEffect(() => {
    const handleCambioEstado = (payload) => {
      const mesaActualizada = payload?.mesa ?? payload
      const mesaId = mesaActualizada?._id ?? mesaActualizada?.id ?? payload?.mesaId ?? payload?.mesa ?? payload?.idMesa
      const estado = mesaActualizada?.estado ?? payload?.nuevoEstado

      if (!mesaId || !estado) return

      setMesas((mesasActuales) =>
        mesasActuales.map((mesa) => {
          const idActual = mesa._id ?? mesa.id
          return String(idActual) === String(mesaId) ? { ...mesa, estado } : mesa
        }),
      )
      setSelectedMesa((mesaActual) => {
        if (!mesaActual) return null
        const idActual = mesaActual._id ?? mesaActual.id
        return String(idActual) === String(mesaId)
          ? { ...mesaActual, estado }
          : mesaActual
      })
    }

    if (socketClient) {
      socketClient.on('cambio-estado-mesa', handleCambioEstado)
    }

    return () => {
      if (socketClient) {
        socketClient.off('cambio-estado-mesa', handleCambioEstado)
      }
    }
  }, [])

  const handleSelectSalon = (salonId) => {
    setError('')
    setIsLoading(true)
    setSelectedMesa(null)
    setSelectedSalonId(String(salonId))
  }

  const handleMesaActualizada = (mesaActualizada) => {
    const targetId = mesaActualizada._id ?? mesaActualizada.id
    setMesas((mesasActuales) =>
      mesasActuales.map((mesa) => {
        const idActual = mesa._id ?? mesa.id
        return String(idActual) === String(targetId) ? mesaActualizada : mesa
      }),
    )
  }

  return (
    <main className="dashboard">
      <header className="dashboard__header">
        <h1>Mapa de mesas</h1>
        <p>Selecciona una mesa para actualizar su estado.</p>
      </header>

      {error && <p className="dashboard__error" role="alert">{error}</p>}

      <section className="dashboard__salones" aria-label="Selector de salón">
        <SalonTabs
          salones={salones}
          selectedSalonId={selectedSalonId}
          onSelectSalon={handleSelectSalon}
        />
      </section>

      <section className="dashboard__mesas" aria-live="polite" aria-busy={isLoading}>
        {isLoading && <p>Cargando mesas...</p>}
        {!isLoading && mesas.length === 0 && <p>No hay mesas para mostrar en este salón.</p>}
        {!isLoading && mesas.length > 0 && (
          <div className="dashboard__grid">
            {mesas.map((mesa) => (
              <MesaCard
                key={mesa._id ?? mesa.id}
                numero={mesa.numero}
                estado={mesa.estado}
                onClick={() => setSelectedMesa(mesa)}
              />
            ))}
          </div>
        )}
      </section>

      <MesaActionModal
        mesa={selectedMesa}
        onClose={() => setSelectedMesa(null)}
        onEstadoActualizado={handleMesaActualizada}
      />
    </main>
  )
}

export default Dashboard
