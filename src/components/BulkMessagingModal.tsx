import React, { useState } from 'react'
import { useUser } from '../App'
import { GROUPS, Group } from '../types'
import { sendBulkSMS, sendBulkWhatsApp, saveMessageLog, MessageLog, MessageResponse, WhatsAppResponse } from '../services/africastalking'

interface BulkMessagingModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function BulkMessagingModal({ isOpen, onClose }: BulkMessagingModalProps) {
  const { roster, currentUser } = useUser()
  const [messageType, setMessageType] = useState<'SMS' | 'WhatsApp'>('SMS')
  const [selectedGroup, setSelectedGroup] = useState<Group | 'all'>('all')
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sendResult, setSendResult] = useState<{
    success: boolean
    message: string
    details?: any
  } | null>(null)

  const handleSendMessage = async () => {
    if (!message.trim() || !currentUser) {
      setSendResult({ success: false, message: 'Tafadhali andika ujumbe na uhakikishe umeingia.' })
      return
    }

    setIsSending(true)
    setSendResult(null)

    try {
      let response
      const group = selectedGroup === 'all' ? undefined : selectedGroup

      if (messageType === 'SMS') {
        response = await sendBulkSMS(roster, message.trim(), group)
      } else {
        response = await sendBulkWhatsApp(roster, message.trim(), group)
      }

      // Log the message
      let recipients: string[] = []
      if (messageType === 'SMS') {
        const smsResponse = response as MessageResponse
        recipients = smsResponse.SMSMessageData.Recipients.map(r => r.number)
      } else {
        const waResponse = response as WhatsAppResponse[]
        recipients = waResponse.map(r => 'unknown') // WhatsApp doesn't return recipient numbers
      }

      const log: MessageLog = {
        id: `${messageType.toLowerCase()}-${Date.now()}`,
        type: messageType,
        message: message.trim(),
        recipients,
        group: group,
        sentBy: currentUser.id,
        sentAt: new Date(),
        status: 'success',
        response
      }

      saveMessageLog(log)

      setSendResult({
        success: true,
        message: `Ujumbe wa ${messageType} umetumwa kwa mafanikio!`,
        details: response
      })

      // Reset form
      setMessage('')
      setSelectedGroup('all')

    } catch (error: any) {
      console.error('Message sending failed:', error)

      // Log failed message
      const log: MessageLog = {
        id: `${messageType.toLowerCase()}-${Date.now()}`,
        type: messageType,
        message: message.trim(),
        recipients: [],
        group: selectedGroup === 'all' ? undefined : selectedGroup,
        sentBy: currentUser.id,
        sentAt: new Date(),
        status: 'failed',
        response: error.message
      }

      saveMessageLog(log)

      setSendResult({
        success: false,
        message: `Imeshindikana kutuma ujumbe: ${error.message}`,
        details: error
      })
    } finally {
      setIsSending(false)
    }
  }

  // Calculate recipient counts
  const getRecipientCount = () => {
    if (!roster) return 0

    let members = roster
    if (selectedGroup !== 'all') {
      members = members.filter(m => m.group === selectedGroup)
    }

    if (messageType === 'SMS') {
      return members.filter(m => m.phoneNumber).length
    } else {
      return members.filter(m => m.whatsappNumber).length
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-2xl">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-bold text-red-700 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Tuma Ujumbe kwa Wingi
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {sendResult && (
          <div className={`p-4 rounded-lg mb-4 ${sendResult.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            <p className="font-semibold">{sendResult.success ? 'Mafanikio!' : 'Kosa!'}</p>
            <p>{sendResult.message}</p>
            {sendResult.details && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm">Maelezo zaidi</summary>
                <pre className="text-xs mt-1 overflow-auto max-h-32">{JSON.stringify(sendResult.details, null, 2)}</pre>
              </details>
            )}
          </div>
        )}

        <div className="space-y-4">
          {/* Message Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Aina ya Ujumbe</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="SMS"
                  checked={messageType === 'SMS'}
                  onChange={(e) => setMessageType(e.target.value as 'SMS')}
                  className="mr-2"
                />
                SMS
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="WhatsApp"
                  checked={messageType === 'WhatsApp'}
                  onChange={(e) => setMessageType(e.target.value as 'WhatsApp')}
                  className="mr-2"
                />
                WhatsApp
              </label>
            </div>
          </div>

          {/* Group Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kundi Lengwa</label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value as Group | 'all')}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">Wanajumuiya Wote</option>
              <option value={GROUPS.WAWATA}>WAWATA (Wanawake Wazima)</option>
              <option value={GROUPS.UWAKA}>UWAKA (Wanaume Wazima)</option>
              <option value={GROUPS.VIJANA}>Vijana</option>
              <option value={GROUPS.WATOTO}>Watoto</option>
            </select>
          </div>

          {/* Recipient Count */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Wapokeaji:</strong> {getRecipientCount()} wanajumuiya
              {selectedGroup !== 'all' && ` katika kundi la ${selectedGroup}`}
            </p>
          </div>

          {/* Message Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ujumbe</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              rows={4}
              placeholder={`Andika ujumbe wa ${messageType}...`}
              maxLength={160}
            />
            <p className="text-xs text-gray-500 mt-1">{message.length}/160 herufi</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSendMessage}
              disabled={isSending || !message.trim()}
              className="flex-1 px-4 py-2 bg-red-700 text-white font-semibold rounded-lg shadow-lg hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? `Inatuma ${messageType}...` : `Tuma ${messageType}`}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-lg hover:bg-gray-400 transition-colors"
            >
              Funga
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
