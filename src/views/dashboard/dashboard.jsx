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

  useEffect(() => {
    let isCurrent = true

    apiClient
      .get('/salones')
      .then(({ data }) => {
        if (!isCurrent) return

        const salonesCargados = Array.isArray(data) ? data : data.salones ?? []
        setSalones(salonesCargados)

        if (salonesCargados.length > 0) {
          setSelectedSalonId(String(salonesCargados[0].id))
        } else {
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (isCurrent) {
          setError('No fue posible cargar los salones.')
          setIsLoading(false)
        }
      })

    return () => {
      isCurrent = false
    }
  }, [])

  useEffect(() => {
    if (!selectedSalonId) return undefined

    let isCurrent = true

    apiClient
      .get(`/mesas/salon/${selectedSalonId}`)
      .then(({ data }) => {
        if (isCurrent) {
          setMesas(Array.isArray(data) ? data : data.mesas ?? [])
        }
      })
      .catch(() => {
        if (isCurrent) {
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

  useEffect(() => {
    const handleCambioEstado = (payload) => {
      const mesaActualizada = payload?.mesa ?? payload
      const mesaId = mesaActualizada?.id ?? payload?.mesaId ?? payload?.idMesa
      const estado = mesaActualizada?.estado ?? payload?.nuevoEstado

      if (!mesaId || !estado) return

      setMesas((mesasActuales) =>
        mesasActuales.map((mesa) =>
          String(mesa.id) === String(mesaId) ? { ...mesa, estado } : mesa,
        ),
      )
      setSelectedMesa((mesaActual) =>
        mesaActual && String(mesaActual.id) === String(mesaId)
          ? { ...mesaActual, estado }
          : mesaActual,
      )
    }

    socketClient.on('cambio-estado-mesa', handleCambioEstado)

    return () => {
      socketClient.off('cambio-estado-mesa', handleCambioEstado)
    }
  }, [])

  const handleSelectSalon = (salonId) => {
    setError('')
    setIsLoading(true)
    setSelectedMesa(null)
    setSelectedSalonId(String(salonId))
  }

  const handleMesaActualizada = (mesaActualizada) => {
    setMesas((mesasActuales) =>
      mesasActuales.map((mesa) =>
        String(mesa.id) === String(mesaActualizada.id) ? mesaActualizada : mesa,
      ),
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
                key={mesa.id}
                numeroMesa={mesa.numeroMesa ?? mesa.numero}
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
