import { useCallback, useEffect, useState } from 'react'
import { apiClient } from '../../api/apiClient'
import './gestion-mesas.css'

function getErrorMessage(error, fallback) {
  return error.response?.data?.message ?? fallback
}

function GestionMesas() {
  const [salones, setSalones] = useState([])
  const [salonSeleccionado, setSalonSeleccionado] = useState('')
  const [mesas, setMesas] = useState([])
  const [cantidad, setCantidad] = useState(1)

  const [isLoading, setIsLoading] = useState(true)
  const [cargandoMesas, setCargandoMesas] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alerta, setAlerta] = useState(null)

  const [mesaQR, setMesaQR] = useState(null)

  // Cargar salones
  const loadSalones = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data } = await apiClient.get('/salones')
      const listaSalones = Array.isArray(data) ? data : data.salones ?? []
      setSalones(listaSalones)

      if (listaSalones.length > 0 && !salonSeleccionado) {
        setSalonSeleccionado(listaSalones[0]._id ?? listaSalones[0].id)
      }
    } catch (error) {
      setAlerta({
        tipo: 'error',
        texto: getErrorMessage(error, 'No fue posible cargar los salones.'),
      })
    } finally {
      setIsLoading(false)
    }
  }, [salonSeleccionado])

  // Cargar mesas por salón
  const loadMesas = useCallback(async (salonId) => {
    if (!salonId) return
    setCargandoMesas(true)

    try {
      const { data } = await apiClient.get(`/mesas/${salonId}`)
      setMesas(Array.isArray(data) ? data : data.mesas ?? [])
    } catch (error) {
      setAlerta({
        tipo: 'error',
        texto: getErrorMessage(error, 'No fue posible cargar las mesas del salón.'),
      })
    } finally {
      setCargandoMesas(false)
    }
  }, [])

  // Carga inicial con prevención de fugas de memoria (isCurrent)
  useEffect(() => {
    let isCurrent = true

    apiClient
      .get('/salones')
      .then(({ data }) => {
        if (isCurrent) {
          const listaSalones = Array.isArray(data) ? data : data.salones ?? []
          setSalones(listaSalones)

          if (listaSalones.length > 0) {
            const primerId = listaSalones[0]._id ?? listaSalones[0].id
            setSalonSeleccionado(primerId)
            loadMesas(primerId)
          }
        }
      })
      .catch((error) => {
        if (isCurrent) {
          setAlerta({
            tipo: 'error',
            texto: getErrorMessage(error, 'No fue posible cargar los salones.'),
          })
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
  }, [loadMesas])

  // Manejar cambio de salón
  const handleSalonChange = (event) => {
    const id = event.target.value
    setSalonSeleccionado(id)
    loadMesas(id)
  }

  // Crear mesas
  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!salonSeleccionado) {
      setAlerta({ tipo: 'error', texto: 'Selecciona un salón para agregar mesas.' })
      return
    }

    const numCantidad = Number(cantidad)
    if (isNaN(numCantidad) || numCantidad < 1) {
      setAlerta({ tipo: 'error', texto: 'La cantidad debe ser al menos 1.' })
      return
    }

    setAlerta(null)
    setIsSubmitting(true)

    try {
      await apiClient.post('/mesas', {
        cantidad: numCantidad,
        salonId: salonSeleccionado,
      })
      setCantidad(1)
      setAlerta({ tipo: 'exito', texto: 'Mesas creadas correctamente.' })
      await loadMesas(salonSeleccionado)
    } catch (error) {
      setAlerta({
        tipo: 'error',
        texto: getErrorMessage(error, 'No fue posible crear las mesas.'),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Eliminar mesa
  const handleDelete = async (mesa) => {
    const mesaId = mesa._id ?? mesa.id

    if (!mesaId) {
      setAlerta({ tipo: 'error', texto: 'La mesa no tiene un identificador válido.' })
      return
    }

    if (!window.confirm(`¿Eliminar la mesa #${mesa.numero}?`)) return

    setAlerta(null)
    setIsSubmitting(true)

    try {
      await apiClient.delete(`/mesas/${mesaId}`)
      setAlerta({ tipo: 'exito', texto: 'Mesa eliminada correctamente.' })
      await loadMesas(salonSeleccionado)
    } catch (error) {
      setAlerta({
        tipo: 'error',
        texto: getErrorMessage(error, 'No se puede eliminar esta mesa.'),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getQRUrl = (token) => `${window.location.origin}/cliente/mesa/${token}`

  return (
    <main className="gestion-mesas">
      <header className="gestion-mesas__header">
        <h1>Gestión de mesas</h1>
        <p>Administra las mesas y genera sus códigos QR según el salón.</p>
      </header>

      {/* Panel de Controles */}
      <section className="gestion-mesas__panel" aria-labelledby="crear-mesa-title">
        <h2 id="crear-mesa-title">Configuración y Creación</h2>

        <div className="gestion-mesas__controls">
          <div className="gestion-mesas__field">
            <label htmlFor="salon-select">Salón activo</label>
            {isLoading ? (
              <p>Cargando salones...</p>
            ) : (
              <select
                id="salon-select"
                value={salonSeleccionado}
                onChange={handleSalonChange}
                disabled={isSubmitting}
              >
                {salones.length === 0 ? (
                  <option value="">No hay salones disponibles</option>
                ) : (
                  salones.map((salon) => {
                    const id = salon._id ?? salon.id
                    return (
                      <option key={id} value={id}>
                        {salon.nombre}
                      </option>
                    )
                  })
                )}
              </select>
            )}
          </div>

          <form className="gestion-mesas__form" onSubmit={handleSubmit} noValidate>
            <label htmlFor="cantidad-mesas">Agregar mesas</label>
            <div className="gestion-mesas__form-row">
              <input
                id="cantidad-mesas"
                name="cantidad"
                type="number"
                min="1"
                max="50"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                disabled={isSubmitting || !salonSeleccionado}
              />
              <button type="submit" disabled={isSubmitting || !salonSeleccionado}>
                {isSubmitting ? 'Creando...' : 'Crear Mesas'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {alerta && (
        <p className={`gestion-mesas__alert gestion-mesas__alert--${alerta.tipo}`} role="alert">
          {alerta.texto}
        </p>
      )}

      {/* Tarjetas de Mesas */}
      <section className="gestion-mesas__panel" aria-labelledby="mesas-title">
        <h2 id="mesas-title">Mesas del salón</h2>

        {cargandoMesas ? (
          <p>Cargando mesas...</p>
        ) : mesas.length === 0 ? (
          <p>
            {salonSeleccionado
              ? 'No hay mesas creadas en este salón.'
              : 'Selecciona un salón para revisar sus mesas.'}
          </p>
        ) : (
          <div className="gestion-mesas__grid">
            {mesas.map((mesa) => {
              const mesaId = mesa._id ?? mesa.id
              return (
                <div key={mesaId} className="gestion-mesas__card">
                  <div className="gestion-mesas__card-header">
                    <span className="gestion-mesas__card-title">Mesa #{mesa.numero}</span>
                    <span className={`gestion-mesas__badge gestion-mesas__badge--${mesa.estado?.toLowerCase()}`}>
                      {mesa.estado}
                    </span>
                  </div>

                  <div className="gestion-mesas__qr-preview" onClick={() => setMesaQR(mesa)}>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                        getQRUrl(mesa.qr_token)
                      )}`}
                      alt={`QR Mesa ${mesa.numero}`}
                    />
                    <small>Ver ampliado</small>
                  </div>

                  <div className="gestion-mesas__card-actions">
                    <button
                      type="button"
                      className="gestion-mesas__btn-secondary"
                      onClick={() => setMesaQR(mesa)}
                    >
                      Ver QR
                    </button>
                    <button
                      type="button"
                      className="gestion-mesas__delete"
                      onClick={() => handleDelete(mesa)}
                      disabled={isSubmitting || mesa.estado !== 'Libre'}
                      title={mesa.estado !== 'Libre' ? 'Solo puedes borrar mesas libres' : ''}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Modal QR */}
      {mesaQR && (
        <div className="gestion-mesas__modal-overlay" onClick={() => setMesaQR(null)}>
          <div
            className="gestion-mesas__modal-content print-area"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="gestion-mesas__modal-close no-print"
              onClick={() => setMesaQR(null)}
            >
              ×
            </button>
            <h3>Mesa #{mesaQR.numero}</h3>
            <p className="no-print">Escanea para acceder a la carta y realizar pedidos.</p>

            <div className="gestion-mesas__qr-large">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                  getQRUrl(mesaQR.qr_token)
                )}`}
                alt={`QR Mesa ${mesaQR.numero}`}
              />
            </div>

            <div className="gestion-mesas__modal-actions no-print">
              <button type="button" onClick={() => window.print()}>
                Imprimir QR
              </button>
              <button
                type="button"
                className="gestion-mesas__btn-secondary"
                onClick={() => setMesaQR(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default GestionMesas