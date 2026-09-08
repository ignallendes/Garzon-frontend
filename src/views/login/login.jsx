import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../../api/apiClient'
import LoginForm from '../../components/login-form/login-form'
import './login.css'

function Login() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])

  const handleLogin = async (credentials) => {
    setError('')

    try {
      const { data } = await apiClient.post('/auth/login', credentials)
      const { token, usuario } = data

      if (!token || !usuario) {
        throw new Error('La respuesta de autenticación es inválida.')
      }

      localStorage.setItem('token', token)
      localStorage.setItem('usuario', JSON.stringify(usuario))
      navigate('/dashboard', { replace: true })
    } catch {
      setError('Credenciales inválidas.')
    }
  }

  return (
    <main className="login-view">
      <section className="login-view__card" aria-labelledby="login-title">
        <h1 id="login-title">Iniciar sesión</h1>
        <p className="login-view__description">
          Accede a la administración del restaurante.
        </p>
        <LoginForm onSubmit={handleLogin} error={error} />
      </section>
    </main>
  )
}

export default Login
