import { useCallback, useEffect, useState } from 'react'
import { apiClient } from '../../api/apiClient'
import { useAuth } from '../../context/useAuth'
import './UsuariosView.css'

const roles = ['Garzon', 'Caja', 'Admin']

function UsuariosView() {
  const { usuario: usuarioActual } = useAuth()
  const [usuarios, setUsuarios] = useState([])
  const [form, setForm] = useState({ nombre: '', username: '', password: '', rol: 'Garzon' })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [updatingId, setUpdatingId] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadUsuarios = useCallback(async () => {
    setIsLoading(true)

    try {
      const { data } = await apiClient.get('/usuarios')
      setUsuarios(Array.isArray(data) ? data : data.usuarios ?? [])
    } catch {
      setError('No fue posible cargar los usuarios.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let isCurrent = true

    apiClient
      .get('/usuarios')
      .then(({ data }) => {
        if (isCurrent) {
          setUsuarios(Array.isArray(data) ? data : data.usuarios ?? [])
        }
      })
      .catch(() => {
        if (isCurrent) {
          setError('No fue posible cargar los usuarios.')
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

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  const handleRegister = async (event) => {
    event.preventDefault()
    const { nombre, username, password, rol } = form

    if (!nombre.trim() || !username.trim() || !password) {
      setError('Completa todos los campos para registrar un usuario.')
      return
    }

    setError('')
    setSuccess('')
    setIsSubmitting(true)

    try {
      await apiClient.post('/auth/registro', {
        nombre: nombre.trim(),
        username: username.trim(),
        password,
        rol,
      })
      setForm({ nombre: '', username: '', password: '', rol: 'Garzon' })
      setSuccess('Usuario registrado correctamente.')
      await loadUsuarios()
    } catch {
      setError('No fue posible registrar el usuario.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEstado = async (usuario) => {
    const usuarioId = usuario._id ?? usuario.id
    const usuarioActualId = usuarioActual?._id ?? usuarioActual?.id

    if (!usuarioId || String(usuarioId) === String(usuarioActualId)) return

    setError('')
    setUpdatingId(String(usuarioId))

    try {
      const activo = !usuario.activo
      const { data } = await apiClient.patch(`/usuarios/${usuarioId}/estado`, { activo })
      const usuarioActualizado = data?.usuario ?? data
      setUsuarios((usuariosActuales) =>
        usuariosActuales.map((item) => {
          const itemId = item._id ?? item.id
          return String(itemId) === String(usuarioId)
            ? { ...item, ...usuarioActualizado, activo: usuarioActualizado?.activo ?? activo }
            : item
        }),
      )
    } catch {
      setError('No fue posible actualizar el estado del usuario.')
    } finally {
      setUpdatingId('')
    }
  }

  const usuarioActualId = usuarioActual?._id ?? usuarioActual?.id

  return (
    <main className="usuarios-view">
      <header className="usuarios-view__header">
        <h1>Gestión de usuarios</h1>
        <p>Registra cuentas y administra su acceso a la plataforma.</p>
      </header>

      <section className="usuarios-view__panel" aria-labelledby="registro-title">
        <h2 id="registro-title">Registrar usuario</h2>
        <form className="usuarios-view__form" onSubmit={handleRegister} noValidate>
          <label>Nombre<input name="nombre" value={form.nombre} onChange={handleChange} disabled={isSubmitting} /></label>
          <label>Username<input name="username" value={form.username} onChange={handleChange} disabled={isSubmitting} /></label>
          <label>Contraseña<input name="password" type="password" value={form.password} onChange={handleChange} disabled={isSubmitting} /></label>
          <label>Rol<select name="rol" value={form.rol} onChange={handleChange} disabled={isSubmitting}>{roles.map((rol) => <option key={rol} value={rol}>{rol}</option>)}</select></label>
          <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Registrando...' : 'Registrar usuario'}</button>
        </form>
      </section>

      {error && <p className="usuarios-view__message usuarios-view__message--error" role="alert">{error}</p>}
      {success && <p className="usuarios-view__message usuarios-view__message--success" role="status">{success}</p>}

      <section className="usuarios-view__panel" aria-labelledby="usuarios-title">
        <h2 id="usuarios-title">Usuarios registrados</h2>
        {isLoading ? <p>Cargando usuarios...</p> : (
          <div className="usuarios-view__table-wrapper">
            <table>
              <thead><tr><th>Nombre</th><th>Username</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr></thead>
              <tbody>
                {usuarios.map((usuario) => {
                  const usuarioId = usuario._id ?? usuario.id
                  const isCurrentUser = String(usuarioId) === String(usuarioActualId)
                  const isUpdating = String(usuarioId) === updatingId

                  return (
                    <tr key={usuarioId}>
                      <td>{usuario.nombre}</td><td>{usuario.username}</td><td>{usuario.rol}</td>
                      <td>{usuario.activo ? 'Activo' : 'Inactivo'}</td>
                      <td><button type="button" onClick={() => handleEstado(usuario)} disabled={isCurrentUser || isUpdating}>{isUpdating ? 'Actualizando...' : usuario.activo ? 'Desactivar' : 'Activar'}</button></td>
                    </tr>
                  )
                })}
                {usuarios.length === 0 && <tr><td colSpan="5">No hay usuarios registrados.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}

export default UsuariosView
