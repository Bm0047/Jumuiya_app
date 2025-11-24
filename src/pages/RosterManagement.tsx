
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../App'
import { addMember } from '../services/firestore'
import { fetchMembersFromDB, MemberFromDB } from '../services/api'
import { Member, GROUPS } from '../types'

export default function UsimamiziWaJumuiya() {
  const navigate = useNavigate()
  const { roster } = useUser()
  const [showAddForm, setShowAddForm] = useState(false)
  const [dbMembers, setDbMembers] = useState<MemberFromDB[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    role: 'Member',
    group: 'UWAKA',
    phoneNumber: '',
    whatsappNumber: '',
    joinDate: new Date().toISOString().split('T')[0]
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadMembersFromDB = async () => {
      try {
        const members = await fetchMembersFromDB()
        setDbMembers(members)
      } catch (error) {
        console.error('Failed to load members from database:', error)
        alert('Imeshindwa kupata orodha ya wanajumuiya kutoka database.')
      } finally {
        setLoading(false)
      }
    }

    loadMembersFromDB()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name) {
      alert('Tafadhali ingiza jina')
      return
    }

    setSaving(true)
    try {
      const memberData: Omit<Member, 'id'> = {
        name: formData.name,
        role: formData.role as 'Leader' | 'Member',
        group: formData.group as any,
        joinDate: formData.joinDate,
        phoneNumber: formData.phoneNumber || undefined,
        whatsappNumber: formData.whatsappNumber || undefined
      }

      await addMember(memberData)
      alert('Mwanajumuiya ameongezwa!')
      setShowAddForm(false)
      setFormData({
        name: '',
        role: 'Member',
        group: 'UWAKA',
        phoneNumber: '',
        whatsappNumber: '',
        joinDate: new Date().toISOString().split('T')[0]
      })
    } catch (error) {
      console.error('Error adding member:', error)
      alert('Kosa katika kuongeza mwanajumuiya. Jaribu tena.')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const getGroupStats = () => {
    const groups = Object.values(GROUPS)
    return groups.map(group => ({
      name: group,
      count: roster.filter(member => member.group === group).length
    }))
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <button onClick={() => navigate('/dashboard')} className="back-button">
          ← Rudi Dashboard
        </button>
        <h1>Usimamizi wa Jumuiya</h1>
      </div>

      <div className="page-content">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <h3>Hali ya Vikundi</h3>
            <div className="stats-grid">
              {getGroupStats().map(stat => (
                <div key={stat.name} className="stat-item">
                  <h4>{stat.name}</h4>
                  <p>{stat.count} wanajumuiya</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="add-button"
            >
              + Ongeza Mwanajumuiya
            </button>
          </div>

          <div className="md:col-span-2">
            <div className="card">
              <h3>Orodha ya Wanajumuiya ({roster.length})</h3>
              <div className="roster-list">
                {roster.map(member => (
                  <div key={member.id} className="roster-item">
                    <div className="member-info">
                      <h4>{member.name}</h4>
                      <p>Kundi: {member.group}</p>
                      <p>Wadhifa: {member.role}</p>
                      {member.phoneNumber && <p>Simu: {member.phoneNumber}</p>}
                      {member.whatsappNumber && <p>WhatsApp: {member.whatsappNumber}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3>Wanajumuiya kutoka Database ({dbMembers.length})</h3>
              {loading ? (
                <p>Inapakia...</p>
              ) : (
                <div className="roster-list">
                  {dbMembers.map(member => (
                    <div key={member.member_id} className="roster-item">
                      <div className="member-info">
                        <h4>{member.family_name}</h4>
                        <p>Kundi la Umri: {member.age_group}</p>
                        <p>Wadhifa: {member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {showAddForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Ongeza Mwanajumuiya Mpya</h3>
              <form onSubmit={handleSubmit} className="member-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Jina *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jina kamili"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Kundi</label>
                    <select
                      name="group"
                      value={formData.group}
                      onChange={handleChange}
                    >
                      {Object.values(GROUPS).map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Wadhifa</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="Member">Mwanachama</option>
                      <option value="Leader">Kiongozi</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Tarehe ya Kujiunga</label>
                    <input
                      type="date"
                      name="joinDate"
                      value={formData.joinDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Namba ya Simu</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="+255..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Namba ya WhatsApp</label>
                    <input
                      type="tel"
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={handleChange}
                      placeholder="+255..."
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="cancel-button"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="submit-button"
                  >
                    {saving ? 'Inahifadhi...' : 'Hifadhi'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
