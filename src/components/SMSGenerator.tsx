import React, { useState, useEffect } from 'react'
import { HouseRota, Member } from '../types'
import { useUser } from '../App'

export default function SMSGenerator({ rota }: { rota: HouseRota }) {
  const { roster } = useUser()
  const [groupCounts, setGroupCounts] = useState({
    WAWATA: 0,
    UWAKA: 0,
    Vijana: 0,
    Watoto: 0,
    total: 0
  })

  useEffect(() => {
    if (roster) {
      const counts = roster.reduce((acc, member) => {
        if (member.group) {
          acc[member.group] = (acc[member.group] || 0) + 1
        }
        acc.total += 1
        return acc
      }, { WAWATA: 0, UWAKA: 0, Vijana: 0, Watoto: 0, total: 0 })
      setGroupCounts(counts)
    }
  }, [roster])

  const message = `Sala ya Jumamosi: ${rota.hostName} - ${rota.addressText}\nTarehe: ${rota.date}\nMuda: 12:00\nRamani: ${rota.mapLink ?? '---'}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message)
      alert('Ujumbe umewekwa clipboard')
    } catch {
      prompt('Copy message', message)
    }
  }

  return (
    <div className="card">
      <h4>SMS Generator</h4>
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <h5 className="font-semibold text-gray-700 mb-2">Takwimu za Wanajumuiya</h5>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>WAWATA: {groupCounts.WAWATA}</div>
          <div>UWAKA: {groupCounts.UWAKA}</div>
          <div>Vijana: {groupCounts.Vijana}</div>
          <div>Watoto: {groupCounts.Watoto}</div>
          <div className="col-span-2 font-semibold">Jumla: {groupCounts.total}</div>
        </div>
      </div>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{message}</pre>
      <button onClick={copy}>Nakili Ujumbe</button>
    </div>
  )
}
