import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import './Navbar.css'

function Navbar() {
  const { usuario, isAdmin, logout } = useAuth()

  return (
    <header className="navbar">
      <div className="navbar__identity">
        <span className="navbar__name">{usuario?.nombre ?? usuario?.username}</span>
        <span className="navbar__role">{usuario?.rol}</span>
      </div>
      <nav className="navbar__links" aria-label="Navegación principal">
        <NavLink to="/dashboard" className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}>
          Mesas
        </NavLink>
        {isAdmin && (
          <>
            <NavLink to="/usuarios" className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}>
              Gestión Usuarios
            </NavLink>
            <NavLink to="/admin/salones" className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}>
              Gestión de Salones
            </NavLink>
            <NavLink to="/admin/mesas" className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}>
              Gestión de Mesas
            </NavLink>
          </>
        )}
      </nav>
      <button className="navbar__logout" type="button" onClick={logout}>
        Cerrar sesión
      </button>
    </header>
  )
}

export default Navbar
