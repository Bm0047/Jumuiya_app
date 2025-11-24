import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../App'
import { sendBulkSMS, sendBulkWhatsApp, getMembersByGroup, getSMSRecipients, getWhatsAppRecipients } from '../services/africastalking'
import { Member } from '../types'

export default function BulkMessaging() {
  const navigate = useNavigate()
  const { roster } = useUser()
  const [formData, setFormData] = useState({
    message: '',
    messageType: 'SMS',
    targetGroup: 'all'
  })
  const [sending, setSending] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.message) {
      alert('Tafadhali andika ujumbe')
      return
    }

    setSending(true)
    try {
      let targetMembers = roster

      if (formData.targetGroup !== 'all') {
        targetMembers = getMembersByGroup(roster, formData.targetGroup)
      }

      if (formData.messageType === 'SMS') {
        const recipients = getSMSRecipients(targetMembers)
        if (recipients.length === 0) {
          alert('Hakuna wanajumuiya walio na namba ya simu')
          return
        }

        const result = await sendBulkSMS(targetMembers, formData.message, formData.targetGroup === 'all' ? undefined : formData.targetGroup)
        setResults({
          type: 'SMS',
          recipients: recipients.length,
          result
        })
        alert(`SMS zimetumwa kwa ${recipients.length} wanajumuiya!`)
      } else {
        const recipients = getWhatsAppRecipients(targetMembers)
        if (recipients.length === 0) {
          alert('Hakuna wanajumuiya walio na namba ya WhatsApp')
          return
        }

        const results = await sendBulkWhatsApp(targetMembers, formData.message, formData.targetGroup === 'all' ? undefined : formData.targetGroup)
        setResults({
          type: 'WhatsApp',
          recipients: recipients.length,
          results
        })
        alert(`Ujumbe wa WhatsApp umetumwa kwa ${recipients.length} wanajumuiya!`)
      }
    } catch (error) {
      console.error('Error sending messages:', error)
      alert('Kosa katika kutuma ujumbe. Jaribu tena.')
    } finally {
      setSending(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const getGroupStats = () => {
    const groups = ['WAWATA', 'UWAKA', 'Vijana', 'Watoto']
    return groups.map(group => ({
      name: group,
      smsCount: getSMSRecipients(getMembersByGroup(roster, group)).length,
      whatsappCount: getWhatsAppRecipients(getMembersByGroup(roster, group)).length
    }))
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <button onClick={() => navigate('/dashboard')} className="back-button">
          ← Rudi Dashboard
        </button>
        <h1>Tuma Ujumbe kwa Wingi</h1>
      </div>

      <div className="page-content">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3>Hali ya Wanajumuiya</h3>
            <div className="stats-grid">
              {getGroupStats().map(stat => (
                <div key={stat.name} className="stat-item">
                  <h4>{stat.name}</h4>
                  <p>SMS: {stat.smsCount}</p>
                  <p>WhatsApp: {stat.whatsappCount}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3>Tuma Ujumbe Mpya</h3>
            <form onSubmit={handleSubmit} className="message-form">
              <div className="form-group">
                <label>Aina ya Ujumbe</label>
                <select
                  name="messageType"
                  value={formData.messageType}
                  onChange={handleChange}
                >
                  <option value="SMS">SMS</option>
                  <option value="WhatsApp">WhatsApp</option>
                </select>
              </div>

              <div className="form-group">
                <label>Kundi Lengwa</label>
                <select
                  name="targetGroup"
                  value={formData.targetGroup}
                  onChange={handleChange}
                >
                  <option value="all">Wote</option>
                  <option value="WAWATA">WAWATA</option>
                  <option value="UWAKA">UWAKA</option>
                  <option value="Vijana">Vijana</option>
                  <option value="Watoto">Watoto</option>
                </select>
              </div>

              <div className="form-group">
                <label>Ujumbe *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Andika ujumbe wako hapa..."
                  rows={4}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="submit-button"
              >
                {sending ? 'Inatuma...' : `Tuma ${formData.messageType}`}
              </button>
            </form>
          </div>
        </div>

        {results && (
          <div className="card">
            <h3>Matokeo ya Kutuma</h3>
            <div className="results">
              <p><strong>Aina:</strong> {results.type}</p>
              <p><strong>Waliopokea:</strong> {results.recipients}</p>
              {results.type === 'SMS' && results.result && (
                <div>
                  <p><strong>Hali:</strong> {results.result.SMSMessageData?.Message}</p>
                  <p><strong>Waliopokea:</strong> {results.result.SMSMessageData?.Recipients?.length || 0}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
