import { useState } from 'react'
import './login-form.css'

function LoginForm({ onSubmit, error }) {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [validationError, setValidationError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!usuario.trim() || !password) {
      setValidationError('Ingresa tu usuario o correo y contraseña.')
      return
    }

    setValidationError('')
    setIsSubmitting(true)

    try {
      await onSubmit({ usuario: usuario.trim(), password })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <div className="login-form__field">
        <label htmlFor="usuario">Usuario o correo</label>
        <input
          id="usuario"
          name="usuario"
          type="text"
          autoComplete="username"
          value={usuario}
          onChange={(event) => setUsuario(event.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="login-form__field">
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={isSubmitting}
        />
      </div>

      {(validationError || error) && (
        <p className="login-form__error" role="alert">
          {validationError || error}
        </p>
      )}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Cargando...' : 'Iniciar sesión'}
      </button>
    </form>
  )
}

export default LoginForm
