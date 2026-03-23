import React, { useEffect } from 'react'
import api from '../api'

export default function Logout() {
  useEffect(() => {
    // Attempt to invalidate token on server
    api.post('/api/logout')
      .finally(() => {
        // Always clear local storage and redirect
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        // Hard redirect to ensure state is cleared
        window.location.href = ''
      })
  }, [])

  return (
    <div className="page-container-centered cg-text-muted" style={{ flexDirection: 'column' }}>
      Logging out...
    </div>
  )
}