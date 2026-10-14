import { useState } from 'react'

const AUTH_URL = 'http://localhost:8080/api/auth'

export default function Login({ onAuthenticated }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = mode === 'login' ? '/login' : '/register'
      const body = mode === 'login'
        ? { email, password }
        : { name, email, password }

      const response = await fetch(AUTH_URL + endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed.')
      }

      onAuthenticated(data)
    } catch (err) {
      setError(err.message || 'Could not connect to MediCare. Check the backend.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '13px',
    border: '1px solid #d8e7e5',
    borderRadius: '8px',
    marginTop: '7px',
    fontSize: '15px',
  }

  return (
    <main style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      padding: '24px',
      boxSizing: 'border-box',
      background: 'linear-gradient(120deg, #effbf9, #f7fbff)',
      fontFamily: 'Inter, Arial, sans-serif',
    }}>
      <section style={{
        width: '100%',
        maxWidth: '420px',
        padding: '34px',
        boxSizing: 'border-box',
        background: '#ffffff',
        border: '1px solid #e1efed',
        borderRadius: '20px',
        boxShadow: '0 18px 55px #164c4712',
      }}>
        <h1 style={{ textAlign: 'center', color: '#078b82', margin: '0 0 8px' }}>
          ✚ MediCare
        </h1>
        <p style={{ textAlign: 'center', color: '#657a80', lineHeight: 1.6 }}>
          Your health, our priority
        </p>

        <div style={{ display: 'flex', gap: '10px', margin: '24px 0' }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setError('') }}
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid #078b82',
              borderRadius: '8px',
              cursor: 'pointer',
              background: mode === 'login' ? '#078b82' : '#ffffff',
              color: mode === 'login' ? '#ffffff' : '#078b82',
            }}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError('') }}
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid #078b82',
              borderRadius: '8px',
              cursor: 'pointer',
              background: mode === 'register' ? '#078b82' : '#ffffff',
              color: mode === 'register' ? '#ffffff' : '#078b82',
            }}
          >
            Register
          </button>
        </div>

        <h2 style={{ color: '#173b43', fontSize: '22px' }}>
          {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
        </h2>
        <p style={{ color: '#657a80', fontSize: '14px' }}>
          {mode === 'login'
            ? 'Log in to access your MediCare account.'
            : 'Register to start using MediCare.'}
        </p>

        <form onSubmit={submit}>
          {mode === 'register' && (
            <label style={{ display: 'block', marginTop: '18px', fontWeight: 600 }}>
              Full Name
              <input
                style={inputStyle}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />
            </label>
          )}

          <label style={{ display: 'block', marginTop: '18px', fontWeight: 600 }}>
            Email Address
            <input
              style={inputStyle}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </label>

          <label style={{ display: 'block', marginTop: '18px', fontWeight: 600 }}>
            Password
            <input
              style={inputStyle}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'register' ? 'At least 8 characters' : 'Enter your password'}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              minLength={mode === 'register' ? 8 : undefined}
              required
            />
          </label>

          {error && (
            <p role="alert" style={{ color: '#c43d3d', fontSize: '14px', lineHeight: 1.6 }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              marginTop: '24px',
              padding: '14px',
              background: '#078b82',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 700,
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Login to MediCare' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#657a80', marginTop: '22px' }}>
          MediCare academic project demonstration
        </p>
      </section>
    </main>
  )
}