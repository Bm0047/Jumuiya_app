import React from 'react'
import { HouseRota } from '../types'

export default function RotaCard({ rota }: { rota: HouseRota }) {
  const openMap = () => {
    if (!rota.mapLink) return alert('No map link provided')
    // Open map in new tab (works for web; on mobile the browser will delegate to maps app)
    window.open(rota.mapLink, '_blank')
  }

  const generateSMS = () => {
    const message = `Sala ya Jumamosi: ${rota.hostName} - ${rota.addressText}\nTarehe: ${rota.date}\nMuda: 12:00\nRamani: ${rota.mapLink ?? '---'}`
    navigator.clipboard?.writeText(message)
      .then(() => alert('Ujumbe umewekwa clipboard'))
      .catch(() => prompt('Copy this message', message))
  }

  return (
    <div className="card">
      <h3>{rota.hostName}</h3>
      <p>{rota.addressText}</p>
      <p><strong>{rota.date}</strong> — 12:00</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={openMap}>Njia ya Kuelekea Nyumbani</button>
        <button onClick={generateSMS}>Nakili Ujumbe (SMS)</button>
      </div>
    </div>
  )
}
