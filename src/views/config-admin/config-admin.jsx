import { useCallback, useEffect, useState } from 'react'
import { apiClient } from '../../api/apiClient'
import MesaMasivaForm from '../../components/mesa-masiva-form/mesa-masiva-form'
import QrCard from '../../components/qr-card/qr-card'
import SalonForm from '../../components/salon-form/salon-form'
import './config-admin.css'

function ConfigAdmin() {
  const [salones, setSalones] = useState([])
  const [selectedSalonId, setSelectedSalonId] = useState('')
  const [mesas, setMesas] = useState([])
  const [isLoadingSalones, setIsLoadingSalones] = useState(true)
  const [isLoadingMesas, setIsLoadingMesas] = useState(false)
  const [error, setError] = useState('')

  const loadSalones = useCallback(async () => {
    try {
      const { data } = await apiClient.get('/salones')
      setSalones(Array.isArray(data) ? data : data.salones ?? [])
    } catch {
      setError('No fue posible cargar los salones.')
    } finally {
      setIsLoadingSalones(false)
    }
  }, [])

  const loadMesas = useCallback(async (salonId) => {
    setIsLoadingMesas(true)

    try {
      const { data } = await apiClient.get(`/mesas/${salonId}`)
      setMesas(Array.isArray(data) ? data : data.mesas ?? [])
    } catch {
      setMesas([])
      setError('No fue posible cargar las mesas del salón.')
    } finally {
      setIsLoadingMesas(false)
    }
  }, [])

  useEffect(() => {
    let isCurrent = true

    apiClient
      .get('/salones')
      .then(({ data }) => {
        if (isCurrent) {
          setSalones(Array.isArray(data) ? data : data.salones ?? [])
        }
      })
      .catch(() => {
        if (isCurrent) {
          setError('No fue posible cargar los salones.')
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoadingSalones(false)
        }
      })

    return () => {
      isCurrent = false
    }
  }, [])

  const handleSalonChange = (event) => {
    const salonId = event.target.value
    setError('')
    setSelectedSalonId(salonId)

    if (!salonId) {
      setMesas([])
      return
    }

    loadMesas(salonId)
  }

  const handlePrint = () => {
    window.print()
  }

  const selectedSalon = salones.find(
    (salon) => String(salon._id ?? salon.id) === selectedSalonId,
  )

  return (
    <main className="config-admin">
      <header className="config-admin__header">
        <div>
          <h1>Configuración del restaurante</h1>
          <p>Administra salones, mesas y sus códigos QR.</p>
        </div>
        <button
          className="config-admin__print-button"
          type="button"
          onClick={handlePrint}
          disabled={mesas.length === 0}
        >
          Imprimir QRs
        </button>
      </header>

      {error && <p className="config-admin__error" role="alert">{error}</p>}

      <section className="config-admin__forms" aria-label="Crear salones y mesas">
        <article className="config-admin__panel">
          <h2>Nuevo salón</h2>
          <SalonForm onSalonCreated={loadSalones} />
        </article>
        <article className="config-admin__panel">
          <h2>Crear mesa</h2>
          <MesaMasivaForm
            salones={salones}
            onMesasCreated={() => {
              if (selectedSalonId) {
                loadMesas(selectedSalonId)
              }
            }}
          />
        </article>
      </section>

      <section className="config-admin__panel config-admin__salones" aria-labelledby="salones-title">
        <h2 id="salones-title">Salones</h2>
        {isLoadingSalones ? (
          <p>Cargando salones...</p>
        ) : (
          <label className="config-admin__selector" htmlFor="salon-selector">
            Selecciona un salón
            <select id="salon-selector" value={selectedSalonId} onChange={handleSalonChange}>
              <option value="">Selecciona un salón</option>
              {salones.map((salon) => (
                <option key={salon._id ?? salon.id} value={salon._id ?? salon.id}>
                  {salon.nombre}
                </option>
              ))}
            </select>
          </label>
        )}
      </section>

      <section className="config-admin__qr-section" aria-labelledby="qr-grid-title">
        <div className="config-admin__section-heading">
          <h2 id="qr-grid-title">
            {selectedSalon ? `QRs de ${selectedSalon.nombre}` : 'Códigos QR de las mesas'}
          </h2>
          {selectedSalon && <span>{mesas.length} mesas</span>}
        </div>

        {!selectedSalonId && <p>Selecciona un salón para ver sus mesas.</p>}
        {selectedSalonId && isLoadingMesas && <p>Cargando mesas...</p>}
        {selectedSalonId && !isLoadingMesas && mesas.length === 0 && (
          <p>Este salón aún no tiene mesas.</p>
        )}
        {selectedSalonId && !isLoadingMesas && mesas.length > 0 && (
          <div className="config-admin__qr-grid">
            {mesas.map((mesa) => (
              <QrCard
                key={mesa._id ?? mesa.id}
                numero={mesa.numero}
                qr_token={mesa.qr_token}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default ConfigAdmin
