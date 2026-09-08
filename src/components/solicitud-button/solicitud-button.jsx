import { useEffect, useRef, useState } from 'react'
import './solicitud-button.css'

function SolicitudButton({
  children,
  confirmationMessage,
  onRequest,
  variant = 'default',
}) {
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const resetTimeout = useRef(null)

  useEffect(() => () => clearTimeout(resetTimeout.current), [])

  const handleClick = async () => {
    setStatus('loading')
    setError('')

    try {
      await onRequest()
      setStatus('confirmed')
      resetTimeout.current = setTimeout(() => setStatus('idle'), 4000)
    } catch {
      setStatus('idle')
      setError('No pudimos enviar tu solicitud. Inténtalo otra vez.')
    }
  }

  const isDisabled = status === 'loading' || status === 'confirmed'

  return (
    <div className="solicitud-button">
      <button
        className={`solicitud-button__control solicitud-button__control--${variant}`}
        type="button"
        onClick={handleClick}
        disabled={isDisabled}
      >
        {status === 'loading' ? 'Enviando...' : status === 'confirmed' ? confirmationMessage : children}
      </button>
      {error && <p className="solicitud-button__error" role="alert">{error}</p>}
    </div>
  )
}

export default SolicitudButton
