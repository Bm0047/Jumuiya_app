import React, { useState } from 'react'
import { addMember } from '../services/firestore'
import { createUserCredentials, createUserProfile, createUserAccount } from '../services/auth'
import { GROUPS, Group } from '../types'
import { useUser } from '../App'

interface AddMemberModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

export default function AddMemberModal({ isOpen, onClose, userId }: AddMemberModalProps) {
  const { addNotification } = useUser()
  const [newMemberId, setNewMemberId] = useState('')
  const [familyName, setFamilyName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [selectedGroup, setSelectedGroup] = useState<Group>(GROUPS.UWAKA)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMemberId.trim() || !familyName.trim()) {
      setMessage({ type: 'error', text: 'Jaza sehemu zote.' })
      return
    }

    setIsSaving(true)
    setMessage(null)

    try {
      // Generate credentials for the new member
      const credentials = await createUserCredentials('member')

      // Create Firebase Auth account
      const email = `${phoneNumber.trim()}@community.local`
      const userCredential = await createUserAccount(email, credentials.password)

      // Add member to database
      await addMember({
        name: newMemberId.trim(),
        role: 'Member',
        group: selectedGroup,
        joinDate: new Date().toISOString(),
        familyName: familyName.trim(),
        phoneNumber: phoneNumber.trim() || undefined,
        whatsappNumber: whatsappNumber.trim() || undefined,
        registeredBy: userId,
      })

      // Create user profile with credentials
      await createUserProfile(userCredential.user.uid, {
        name: newMemberId.trim(),
        role: 'Member',
        loginName: credentials.loginName,
        password: credentials.password,
        email: email,
      })

      // Show notification bar with success message
      addNotification(
        `Mwanajumuiya "${newMemberId.trim()}" amesajiliwa!\n\nJina la Kuingia: ${phoneNumber.trim()}\nNenosiri: ${credentials.password}`,
        'success'
      )

      setMessage({
        type: 'success',
        text: `Mwanajumuiya mpya (${newMemberId.trim()}) amesajiliwa!\n\nJina la Kuingia: ${phoneNumber.trim()}\nNenosiri: ${credentials.password}\n\nHifadhi habari hizi kwa usalama!`
      })

      setNewMemberId('')
      setFamilyName('')
      setPhoneNumber('')
      setWhatsappNumber('')
      setSelectedGroup(GROUPS.UWAKA)
    } catch (err) {
      console.error("Error adding member:", err)
      setMessage({ type: 'error', text: 'Kushindwa kusajili. Angalia mtandao.' })
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-bold text-red-700 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            Sajili Mwanajumuiya Mpya
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {message && (
          <div className={`p-3 rounded-lg mb-4 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleAddMember} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">User ID Mpya (Mfano: mtumiaji001)</label>
            <input
              type="text"
              value={newMemberId}
              onChange={(e) => setNewMemberId(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              placeholder="Weka User ID ya kipekee"
              required
            />
            <p className="text-xs text-gray-500 mt-1">ID hii itatumika kumtambua mwanajumuiya huyu.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Jina la Familia Anayotoka</label>
            <input
              type="text"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              placeholder="Mfano: Familia ya Mtakatifu Yosefu"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Namba ya Simu (SMS)</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              placeholder="Mfano: +255712345678"
            />
            <p className="text-xs text-gray-500 mt-1">Namba ya kupokea SMS za kawaida.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Namba ya WhatsApp</label>
            <input
              type="tel"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              placeholder="Mfano: +255712345678"
            />
            <p className="text-xs text-gray-500 mt-1">Namba ya kupokea ujumbe wa WhatsApp.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Kundi</label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value as Group)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              required
            >
              <option value={GROUPS.WAWATA}>WAWATA (Wanawake Wazima)</option>
              <option value={GROUPS.UWAKA}>UWAKA (Wanaume Wazima)</option>
              <option value={GROUPS.VIJANA}>Vijana</option>
              <option value={GROUPS.WATOTO}>Watoto</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Chagua kundi la mwanajumuiya.</p>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-red-700 text-white font-semibold rounded-lg shadow-lg hover:bg-red-800 transition-colors disabled:opacity-50"
            disabled={isSaving}
          >
            {isSaving ? 'Inasajili...' : 'Sajili Mwanajumuiya na Familia'}
          </button>
        </form>
      </div>
    </div>
  )
}
