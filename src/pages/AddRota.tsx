import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../App'
import { addHouseRotaEntry } from '../services/firestore'
import { RotaEntry } from '../types'

export default function AddRota() {
  const navigate = useNavigate()
  const { roster } = useUser()
  const [formData, setFormData] = useState({
    task: '',
    description: '',
    date: '',
    time: '',
    assignedTo: '',
    location: ''
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.task || !formData.date || !formData.assignedTo) {
      alert('Tafadhali jaza sehemu muhimu')
      return
    }

    setSaving(true)
    try {
      const rotaEntry: Omit<RotaEntry, 'id' | 'createdAt' | 'updatedAt'> = {
        task: formData.task,
        assignedTo: formData.assignedTo,
        date: formData.date
      }

      await addHouseRotaEntry(rotaEntry)
      alert('Kazi imewekwa kwenye ratiba!')
      navigate('/dashboard')
    } catch (error) {
      console.error('Error adding rota:', error)
      alert('Kosa katika kuweka kazi. Jaribu tena.')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <button onClick={() => navigate('/dashboard')} className="back-button">
          ← Rudi Dashboard
        </button>
        <h1>Weka Kazi Mpya Kwenye Ratiba</h1>
      </div>

      <div className="page-content">
        <div className="card">
          <form onSubmit={handleSubmit} className="rota-form">
            <div className="form-group">
              <label>Kichwa cha Kazi *</label>
              <input
                type="text"
                name="task"
                value={formData.task}
                onChange={handleChange}
                placeholder="Mfano: Ibada ya Jumapili"
                required
              />
            </div>

            <div className="form-group">
              <label>Maelezo</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Maelezo ya kina kuhusu kazi..."
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tarehe *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Muda</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Mahali</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Mfano: Kanisa Kuu"
              />
            </div>

            <div className="form-group">
              <label>Kabidhiwa kwa *</label>
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                required
              >
                <option value="">Chagua mwanajumuiya...</option>
                {roster.map(member => (
                  <option key={member.id} value={member.name}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="submit-button"
            >
              {saving ? 'Inahifadhi...' : 'Hifadhi Kazi'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
