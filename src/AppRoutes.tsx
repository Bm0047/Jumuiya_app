import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useUser } from './App'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import UsimamiziWaJumuiya from './pages/RosterManagement'
import BulkMessaging from './pages/BulkMessaging'
import AddRota from './pages/AddRota'
import AddAnnouncement from './pages/AddAnnouncement'

export default function AppRoutes() {
  const { currentUser, loading } = useUser()

  // Show loading spinner while determining auth state
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '1.2rem',
        fontWeight: '600'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          Inafungua Maria Magdalena...
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <Routes>
      {/* Redirect authenticated users to dashboard */}
      <Route
        path="/"
        element={currentUser ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/login"
        element={currentUser ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      {/* Protected routes - only accessible when authenticated */}
      <Route
        path="/dashboard"
        element={currentUser ? <Dashboard /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/roster"
        element={currentUser ? <UsimamiziWaJumuiya /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/bulk-messaging"
        element={currentUser ? <BulkMessaging /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/add-rota"
        element={currentUser ? <AddRota /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/add-announcement"
        element={currentUser ? <AddAnnouncement /> : <Navigate to="/login" replace />}
      />
    </Routes>
  )
}
