import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from './authContextStore'

function getStoredUsuario() {
  try {
    const usuario = localStorage.getItem('usuario')
    return usuario ? JSON.parse(usuario) : null
  } catch {
    localStorage.removeItem('usuario')
    return null
  }
}

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(getStoredUsuario)

  const setUsuarioAutenticado = useCallback((nuevoUsuario) => {
    setUsuario(nuevoUsuario)
    localStorage.setItem('usuario', JSON.stringify(nuevoUsuario))
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
    navigate('/login', { replace: true })
  }, [navigate])

  const value = useMemo(
    () => ({
      usuario,
      isAdmin: usuario?.rol === 'Admin',
      setUsuario: setUsuarioAutenticado,
      logout,
    }),
    [logout, setUsuarioAutenticado, usuario],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
