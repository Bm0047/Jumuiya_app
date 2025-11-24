import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../App'
import { addAnnouncement } from '../services/firestore'
import { Announcement } from '../types'

export default function AddAnnouncement() {
  const navigate = useNavigate()
  const { currentUser } = useUser()
  const [formData, setFormData] = useState({
    message: '',
    priority: 'normal',
    category: 'general'
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.message) {
      alert('Tafadhali andika ujumbe wa tangazo')
      return
    }

    setSaving(true)
    try {
      const announcement: Omit<Announcement, 'id' | 'timestamp'> = {
        message: formData.message,
        type: 'TEXT',
        authorId: currentUser?.id || 'unknown',
        authorRole: currentUser?.role || 'Member'
      }

      await addAnnouncement(announcement)
      alert('Tangazo limechapishwa!')
      navigate('/dashboard')
    } catch (error) {
      console.error('Error adding announcement:', error)
      alert('Kosa katika kuchapisha tangazo. Jaribu tena.')
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
        <h1>Tuma Tangazo Jipya</h1>
      </div>

      <div className="page-content">
        <div className="card">
          <form onSubmit={handleSubmit} className="announcement-form">
            <div className="form-group">
              <label>Ujumbe wa Tangazo *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Andika maudhui kamili ya tangazo..."
                rows={6}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Umuhimu</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="low">Ya Kawaida</option>
                  <option value="normal">Muhimu</option>
                  <option value="high">Muhimu Sana</option>
                  <option value="urgent">Haraka</option>
                </select>
              </div>

              <div className="form-group">
                <label>Aina</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="general">Kwa Jumla</option>
                  <option value="worship">Ibada</option>
                  <option value="event">Tukio</option>
                  <option value="announcement">Tangazo</option>
                  <option value="prayer">Maombi</option>
                </select>
              </div>
            </div>

            <div className="form-info">
              <p><strong>Mchapishaji:</strong> {currentUser?.name}</p>
              <p><strong>Tarehe:</strong> {new Date().toLocaleDateString('sw-KE')}</p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="submit-button"
            >
              {saving ? 'Inachapisha...' : 'Chapisha Tangazo'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
