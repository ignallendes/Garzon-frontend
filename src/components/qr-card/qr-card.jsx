import { QRCodeSVG } from 'qrcode.react'
import './qr-card.css'

function QrCard({ numeroMesa, qr_token }) {
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin
  const qrUrl = `${frontendUrl.replace(/\/$/, '')}/qr/${qr_token}`

  const handlePrint = () => {
    window.print()
  }

  return (
    <article className="qr-card">
      <h2 className="qr-card__title">Mesa {numeroMesa}</h2>
      <QRCodeSVG
        className="qr-card__code"
        value={qrUrl}
        size={220}
        level="M"
        includeMargin
        aria-label={`Código QR de la mesa ${numeroMesa}`}
      />
      <p className="qr-card__url">{qrUrl}</p>
      <button className="qr-card__print-button" type="button" onClick={handlePrint}>
        Imprimir QR
      </button>
    </article>
  )
}

export default QrCard
