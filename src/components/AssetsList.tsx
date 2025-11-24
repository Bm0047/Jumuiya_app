import React, { useState, useEffect } from 'react'
import { subscribeToAssets, updateAsset } from '../services/firestore'
import { Asset, User } from '../types'

interface AssetsListProps {
  currentUser: User | null
}

export default function AssetsList({ currentUser }: AssetsListProps) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToAssets((assetsData) => {
      setAssets(assetsData)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const handleToggleStatus = async (asset: Asset) => {
    const newStatus = asset.status === 'available' ? 'borrowed' : 'available'
    try {
      await updateAsset(asset.id, { status: newStatus })
      alert(`Hali ya mali imebadilishwa kuwa: ${newStatus === 'available' ? 'Inapatikana' : 'Imechukuliwa'}`)
    } catch (error) {
      console.error('Error updating asset:', error)
      alert('Kosa limetokea wakati wa kubadilisha hali.')
    }
  }

  const isLeader = currentUser?.role === 'leader'

  if (loading) {
    return (
      <div className="card">
        <p>Inapakia mali...</p>
      </div>
    )
  }

  const availableCount = assets.filter(a => a.status === 'available').length
  const borrowedCount = assets.filter(a => a.status !== 'available').length

  return (
    <div className="card">
      <h3>Mali ya Jumuiya</h3>

      <div style={{ marginBottom: '16px', padding: '12px', background: '#f7fafc', borderRadius: '8px' }}>
        <p style={{ margin: '0', fontSize: '14px' }}>
          <strong>Jumla:</strong> {assets.length} |
          <strong> Zinazopatikana:</strong> {availableCount} |
          <strong> Zilizochukuliwa:</strong> {borrowedCount}
        </p>
      </div>

      {assets.length === 0 ? (
        <p>Hakuna mali iliyosajiliwa.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {assets.map((asset) => (
            <div
              key={asset.id}
              style={{
                padding: '12px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                background: asset.status === 'available' ? '#f0fff4' : '#fff5f5'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600' }}>
                    {asset.name}
                  </h4>
                  <p style={{ margin: '0 0 4px 0', color: '#4a5568', fontSize: '14px' }}>
                    Idadi: {asset.quantity}
                  </p>
                  <p style={{
                    margin: '0',
                    color: asset.status === 'available' ? '#38a169' : '#e53e3e',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Hali: {asset.status === 'available' ? 'Inapatikana' : 'Imechukuliwa'}
                  </p>
                  {asset.description && (
                    <p style={{ margin: '4px 0 0 0', color: '#718096', fontSize: '12px' }}>
                      {asset.description}
                    </p>
                  )}
                </div>
                {isLeader && (
                  <button
                    onClick={() => handleToggleStatus(asset)}
                    style={{
                      background: asset.status === 'available' ? '#e53e3e' : '#38a169',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      marginLeft: '12px'
                    }}
                  >
                    {asset.status === 'available' ? 'Chukua' : 'Rudisha'}
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
