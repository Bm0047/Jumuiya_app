import React, { useState } from 'react'
import { addAnnouncement } from '../services/firestore'
import { User } from '../types'

interface RichAnnouncementFormProps {
  currentUser: User
}

export default function RichAnnouncementForm({ currentUser }: RichAnnouncementFormProps) {
  const [message, setMessage] = useState('')
  const [announcementType, setAnnouncementType] = useState<'TEXT' | 'IMAGE' | 'LINK'>('TEXT')
  const [mediaUrl, setMediaUrl] = useState('')
  const [isPosting, setIsPosting] = useState(false)

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || (announcementType !== 'TEXT' && !mediaUrl.trim())) return

    setIsPosting(true)
    try {
      await addAnnouncement({
        message: message.trim(),
        type: announcementType,
        mediaUrl: announcementType !== 'TEXT' ? mediaUrl.trim() : undefined,
        authorId: currentUser.id,
        authorRole: currentUser.role,
      })
      setMessage('')
      setMediaUrl('')
      setAnnouncementType('TEXT')
    } catch (err) {
      console.error("Failed to post announcement:", err)
      alert("Kushindwa kutuma Tangazo. Angalia mtandao.")
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <form onSubmit={handlePostAnnouncement} className="p-4 bg-gray-100 rounded-xl shadow-md mt-4">
      <h4 className="font-bold text-gray-800 mb-3 flex items-center">
        <svg className="w-4 h-4 mr-2 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
        Tuma Tangazo la Kifahari
      </h4>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700">Aina ya Tangazo</label>
        <select
          value={announcementType}
          onChange={(e) => setAnnouncementType(e.target.value as 'TEXT' | 'IMAGE' | 'LINK')}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
        >
          <option value="TEXT">Ujumbe wa Maneno Tu</option>
          <option value="IMAGE">Picha/Ramani (URL)</option>
          <option value="LINK">Kiungo/Kitabu (URL)</option>
        </select>
      </div>

      {(announcementType === 'IMAGE' || announcementType === 'LINK') && (
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Kiungo cha {announcementType === 'IMAGE' ? 'Picha/Ramani' : 'Link/Kitabu'}
          </label>
          <input
            type="url"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            placeholder="Weka URL hapa (mfano: https://...)"
            required
          />
        </div>
      )}

      <textarea
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
        rows={3}
        placeholder="Andika Ujumbe Mfupi kwa Tangazo hili..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={isPosting}
        required
      />
      <button
        type="submit"
        className="mt-3 w-full px-4 py-2 bg-red-700 text-white font-semibold rounded-lg shadow-lg hover:bg-red-800 transition-colors disabled:opacity-50"
        disabled={isPosting || !message.trim() || (announcementType !== 'TEXT' && !mediaUrl.trim())}
      >
        {isPosting ? 'Inatuma...' : 'Tuma Tangazo Sasa'}
      </button>
    </form>
  )
}
