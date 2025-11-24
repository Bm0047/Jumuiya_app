import React, { useState, useEffect } from 'react'
import { subscribeToRota, deleteRotaEntry } from '../services/firestore'
import { RotaEntry, User } from '../types'

interface RotaListProps {
  currentUser: User | null
}

export default function RotaList({ currentUser }: RotaListProps) {
  const [rota, setRota] = useState<RotaEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToRota((rotaData) => {
      setRota(rotaData)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Una uhakika unataka kufuta kazi hii?')) return

    try {
      await deleteRotaEntry(id)
      alert('Kazi imefutwa!')
    } catch (error) {
      console.error('Error deleting rota entry:', error)
      alert('Kosa limetokea wakati wa kufuta.')
    }
  }

  const isLeader = currentUser?.role === 'leader'

  if (loading) {
    return (
      <div className="card">
        <p>Inapakia kazi...</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h3>Orodha ya Kazi</h3>
      {rota.length === 0 ? (
        <p>Hakuna kazi zilizopangwa.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {rota.map((entry) => (
            <div
              key={entry.id}
              style={{
                padding: '12px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                background: '#f8fafc'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>
                    {entry.task}
                  </h4>
                  <p style={{ margin: '0 0 4px 0', color: '#4a5568' }}>
                    Mwenye kazi: {entry.assignedTo}
                  </p>
                  <p style={{ margin: '0', color: '#718096', fontSize: '14px' }}>
                    Tarehe: {new Date(entry.date).toLocaleDateString('sw-TZ')}
                  </p>
                </div>
                {isLeader && (
                  <button
                    onClick={() => handleDelete(entry.id)}
                    style={{
                      background: '#e53e3e',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      marginLeft: '12px'
                    }}
                  >
                    Futa
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
