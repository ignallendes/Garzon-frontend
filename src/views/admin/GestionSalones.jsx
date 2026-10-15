import { useCallback, useEffect, useState } from 'react'
import { apiClient } from '../../api/apiClient'
import './gestion-salones.css'

function getErrorMessage(error, fallback) {
  return error.response?.data?.message ?? fallback
}

function GestionSalones() {
  const [salones, setSalones] = useState([])
  const [nombre, setNombre] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alerta, setAlerta] = useState(null)

  const loadSalones = useCallback(async () => {
    setIsLoading(true)

    try {
      const { data } = await apiClient.get('/salones')
      setSalones(Array.isArray(data) ? data : data.salones ?? [])
    } catch (error) {
      setAlerta({
        tipo: 'error',
        texto: getErrorMessage(error, 'No fue posible cargar los salones.'),
      })
    } finally {
      setIsLoading(false)
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
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nombreNormalizado = nombre.trim()

    if (!nombreNormalizado) {
      setAlerta({ tipo: 'error', texto: 'Ingresa un nombre para el salón.' })
      return
    }

    setAlerta(null)
    setIsSubmitting(true)

    try {
      await apiClient.post('/salones', { nombre: nombreNormalizado })
      setNombre('')
      setAlerta({ tipo: 'exito', texto: 'Salón creado correctamente.' })
      await loadSalones()
    } catch (error) {
      setAlerta({
        tipo: 'error',
        texto: getErrorMessage(error, 'No fue posible crear el salón.'),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (salon) => {
    const salonId = salon._id ?? salon.id

    if (!salonId) {
      setAlerta({ tipo: 'error', texto: 'El salón no tiene un identificador válido.' })
      return
    }

    if (!window.confirm(`¿Eliminar el salón "${salon.nombre}"?`)) return

    setAlerta(null)
    setIsSubmitting(true)

    try {
      await apiClient.delete(`/salones/${salonId}`)
      setAlerta({ tipo: 'exito', texto: 'Salón eliminado correctamente.' })
      await loadSalones()
    } catch (error) {
      setAlerta({
        tipo: 'error',
        texto: getErrorMessage(error, 'No se puede eliminar este salón.'),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="gestion-salones">
      <header className="gestion-salones__header">
        <h1>Gestión de salones</h1>
        <p>Crea y elimina los salones disponibles en el restaurante.</p>
      </header>

      <section className="gestion-salones__panel" aria-labelledby="crear-salon-title">
        <h2 id="crear-salon-title">Crear salón</h2>
        <form className="gestion-salones__form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="nombre-salon">Nombre del salón</label>
          <div className="gestion-salones__form-row">
            <input
              id="nombre-salon"
              name="nombre"
              type="text"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              disabled={isSubmitting}
              placeholder="Ej.: Terraza"
            />
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Crear Salón'}
            </button>
          </div>
        </form>
      </section>

      {alerta && (
        <p className={`gestion-salones__alert gestion-salones__alert--${alerta.tipo}`} role="alert">
          {alerta.texto}
        </p>
      )}

      <section className="gestion-salones__panel" aria-labelledby="salones-title">
        <h2 id="salones-title">Salones registrados</h2>
        {isLoading ? (
          <p>Cargando salones...</p>
        ) : (
          <div className="gestion-salones__table-wrapper">
            <table className="gestion-salones__table">
              <thead>
                <tr><th>Nombre</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {salones.map((salon) => {
                  const salonId = salon._id ?? salon.id

                  return (
                    <tr key={salonId}>
                      <td>{salon.nombre}</td>
                      <td>
                        <button
                          className="gestion-salones__delete"
                          type="button"
                          onClick={() => handleDelete(salon)}
                          disabled={isSubmitting}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  )
                })}
                {salones.length === 0 && (
                  <tr><td colSpan="2">No hay salones registrados.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}

export default GestionSalones
