import React, { useEffect, useState } from 'react'
import { subscribeToAnnouncements } from '../services/firestore'
import { Announcement } from '../types'

export default function AnnouncementsList() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])

  useEffect(() => {
    const unsubscribe = subscribeToAnnouncements(setAnnouncements)
    return unsubscribe
  }, [])

  return (
    <div className="mt-8 p-6 bg-white rounded-xl shadow-2xl border-l-4 border-red-700">
      <h3 className="text-xl font-extrabold text-red-700 mb-4 flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.868 12.683A17.925 17.925 0 0112 21c7.962 0 12-1.21 12-2.683m-12 2.683l-9-9 3.5-3.5 9 9z" />
        </svg>
        Matangazo Rasmi
      </h3>
      {announcements.length === 0 ? (
        <p className="text-gray-500 italic">Hakuna Matangazo mapya kwa sasa.</p>
      ) : (
        <div className="space-y-6">
          {announcements.map((ann) => (
            <div key={ann.id} className="p-4 bg-red-50/50 border-l-4 border-red-400 rounded-lg shadow-md">
              <p className="text-gray-800 leading-snug font-medium mb-2">{ann.message}</p>

              {/* Rich Content Display */}
              {ann.type === 'IMAGE' && ann.mediaUrl && (
                <a href={ann.mediaUrl} target="_blank" rel="noopener noreferrer">
                  <img
                    src={ann.mediaUrl}
                    alt="Picha ya Tangazo"
                    className="mt-2 w-full h-auto max-h-60 object-cover rounded-lg border border-gray-200"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "https://placehold.co/400x150/ef4444/ffffff?text=Picha+Haipatikani"
                    }}
                  />
                </a>
              )}

              {ann.type === 'LINK' && ann.mediaUrl && (
                <a
                  href={ann.mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold border-b border-blue-400"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Fungua Kiungo/Kitabu
                </a>
              )}

              <p className="text-xs text-red-400 mt-2">
                Kutoka: {ann.authorRole === 'Leader' ? 'Kiongozi' : 'Mwanajumuiya'} | {ann.timestamp ? new Date(ann.timestamp).toLocaleString('sw-TZ') : 'Inapakia...'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
