import React, { useState } from 'react'
import { addRotaEntry } from '../services/firestore'
import { RotaEntry } from '../types'

interface RotaFormProps {
  onSuccess?: () => void
}

export default function RotaForm({ onSuccess }: RotaFormProps) {
  const [formData, setFormData] = useState({
    task: '',
    assignedTo: '',
    date: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.task || !formData.assignedTo || !formData.date) {
      alert('Tafadhali jaza sehemu zote')
      return
    }

    setLoading(true)
    try {
      await addRotaEntry(formData)
      setFormData({ task: '', assignedTo: '', date: '' })
      onSuccess?.()
      alert('Kazi imeongezwa kwa mafanikio!')
    } catch (error) {
      console.error('Error adding rota entry:', error)
      alert('Kosa limetokea. Jaribu tena.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="card">
      <h3>Ongeza Kazi Mpya</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
            Kazi:
          </label>
          <input
            type="text"
            name="task"
            value={formData.task}
            onChange={handleChange}
            placeholder="Mfano: Kuongoza Ibada"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
            Mwenye Kazi:
          </label>
          <input
            type="text"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            placeholder="Jina la mwanachama"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
            Tarehe:
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px'
            }}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            opacity: loading ? 0.6 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Inahifadhi...' : 'Ongeza Kazi'}
        </button>
      </form>
    </div>
  )
}
