import { useEffect, useState } from 'react'
import App from './App.jsx'
import Login from './Login.jsx'

const AUTH_URL = 'http://localhost:8080/api/auth'

export default function AuthGate() {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let active = true

    fetch(`${AUTH_URL}/me`, { credentials: 'include' })
      .then(async (response) => {
        if (!response.ok) return null
        return response.json()
      })
      .then((data) => {
        if (active) setUser(data)
      })
      .catch(() => {
        if (active) setUser(null)
      })
      .finally(() => {
        if (active) setChecking(false)
      })

    return () => { active = false }
  }, [])

  async function logout() {
    try {
      await fetch(`${AUTH_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } finally {
      setUser(null)
    }
  }

  if (checking) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Arial' }}>
        Checking your MediCare session...
      </div>
    )
  }

  if (!user) {
    return <Login onAuthenticated={setUser} />
  }

  return (
    <>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
        gap: '14px',
        padding: '12px 7%',
        background: '#102f35',
        color: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
      }}>
        <span>Logged in as <strong>{user.name}</strong></span>
        <button
          onClick={logout}
          style={{
            padding: '8px 14px',
            border: '1px solid #65d5c9',
            borderRadius: '6px',
            color: '#ffffff',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>
      <App />
    </>
  )
}