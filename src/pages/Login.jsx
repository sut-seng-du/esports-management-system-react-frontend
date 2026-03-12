import React, { useState } from 'react'
import { motion } from 'framer-motion'
import api from '../api'

export default function Login() {
  const [email, setEmail] = useState('guest@gmail.com')
  const [password, setPassword] = useState('123456')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    api.post('/api/login', { email, password })
      .then(r => {
        // Expecting response: { "token": "...", "user": { ... } }
        const { token, user } = r.data

        if (token) {
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(user))

          // Force reload/redirect to ensure axios interceptors (in api.js) pick up the new token
          window.location.href = '/'
        } else {
          setError('No token received from server.')
        }
      })
      .catch(e => {
        console.error(e)
        if (e.response && e.response.status === 422) {
          setError('Invalid email or password.')
        } else {
          setError(e.message || 'Login failed. Please try again.')
        }
      })
      .finally(() => setLoading(false))
  }

  return (
    <section className="page-container-centered">
      <motion.div
        className="cg-card"
        style={{ width: '100%', maxWidth: '400px', padding: 'clamp(18px, 4vw, 30px)' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="cg-text-header" style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', marginBottom: '20px', textAlign: 'center' }}>Login</h2>

        {error && (
          <div className="alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '15px' }}>
            <label className="cg-input-label cg-text-body">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="cg-input"
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label className="cg-input-label cg-text-body">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="cg-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="cg-btn cg-btn-primary"
            style={{
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </section>
  )
}