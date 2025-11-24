import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebaseConfig'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/dashboard')
    } catch (error: any) {
      console.error('Login error:', error)
      setError('Kosa katika kuingia. Tafadhali angalia barua pepe na nenosiri.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">
          Maria Magdalena
        </h1>
        <p className="login-subtitle">
          Jumuiya ya Kikristo
        </p>

        {error && (
          <div style={{
            color: '#e74c3c',
            backgroundColor: '#fdf2f2',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '16px',
            border: '1px solid #f5c6cb'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="email"
            placeholder="Barua pepe"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />

          <input
            type="password"
            placeholder="Nenosiri"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px',
              backgroundColor: loading ? '#95a5a6' : '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Inafungua...' : 'Ingia'}
          </button>
        </form>

        <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
          <p><strong>Akaunti ya Kiongozi:</strong></p>
          <p>Barua pepe: leader@mariamagdalena.org</p>
          <p>Nenosiri: Leader2024!</p>
          <p style={{ color: '#e74c3c', marginTop: '8px' }}>
            ⚠️ Badilisha nenosiri baada ya kuingia mara ya kwanza!
          </p>
        </div>
      </div>
    </div>
  )
}
