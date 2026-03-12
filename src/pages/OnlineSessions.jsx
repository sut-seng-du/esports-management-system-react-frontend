import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Monitor } from 'lucide-react'
import api from '../api'
import computerPng from '../assets/computer.png'

export default function OnlineSessions() {
  const [seats, setSeats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // for “x min ago” live update without refetching
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    let mounted = true
    const fetchOnline = async () => {
      try {
        const res = await api.get('/api/seats')
        if (mounted) {
          setSeats(res.data?.data || [])
          setLoading(false)
        }
      } catch (err) {
        if (mounted) {
          setError(err.response?.data?.message || err.message || 'Failed to fetch online seats')
          setLoading(false)
        }
      }
    }
    fetchOnline()

    const intervalId = setInterval(fetchOnline, 10000)
    const tick = setInterval(() => setNow(Date.now()), 30000)

    return () => {
      mounted = false
      clearInterval(intervalId)
      clearInterval(tick)
    }
  }, [])

  const parseDateToMs = (dateStr) => {
    if (!dateStr) return null
    const ms = Date.parse(dateStr)
    return isNaN(ms) ? null : ms
  }

  const timeAgo = (msStart) => {
    const diff = Math.max(0, now - msStart)
    if (diff <= 0) return 'Just now'

    const seconds = Math.floor(diff / 1000)
    if (seconds < 60) return `${seconds} sec${seconds === 1 ? '' : 's'} ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hr${hours === 1 ? '' : 's'} ago`
    const day = Math.floor(hours / 24)
    return `${day} day${day === 1 ? '' : 's'} ago`
  }

  const seatCount = useMemo(() => seats.length, [seats])

  return (
    <section className="page-container">
      <div className="page-title">
        <h2>
          <Monitor size={28} color="var(--accent)" style={{ verticalAlign: 'middle', marginRight: '10px' }} />
          Seats
        </h2>
        <div className="muted cg-text-muted">{seatCount} seats</div>
      </div>

      {loading && <p>Loading…</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <motion.div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(100px, 15vw, 150px), 1fr))', gap: 'clamp(8px, 2vw, 15px)' }}
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.05 }
            }
          }}
        >
          {seats.length === 0 && <div className="cg-text-muted">No seats defined.</div>}

          {seats.map(s => {
            // ✅ use real "online status time" from backend if available
            const onlineMs = parseDateToMs(s.online_at || s.updated_at || s.last_seen_at)

            return (
              <motion.div
                key={s.id}
                variants={{
                  hidden: { opacity: 0, scale: 0.9, y: 10 },
                  show: { opacity: 1, scale: 1, y: 0 }
                }}
                layout
                whileHover={{ scale: 1.05, y: -4 }}
                style={{
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundImage: `url(${computerPng})`,
                  backgroundColor: s.online ? '#00ff00' : '#ff3333',
                  backgroundSize: '100% 100%',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  aspectRatio: '1',
                  borderRadius: '14px',
                  border: s.online ? '2px solid rgba(0,255,0,0.4)' : '2px solid rgba(255,50,50,0.4)',
                  boxShadow: s.online
                    ? '0 6px 20px rgba(0,255,0,0.25), inset 0 1px 0 rgba(255,255,255,0.15)'
                    : '0 6px 20px rgba(255,50,50,0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
                  cursor: 'default',
                  transition: 'box-shadow 0.3s ease',
                }}
              >
                <div style={{ fontWeight: 'bold', color: s.online ? 'var(--cg-text-black)' : 'var(--cg-text-white)' }}>{s.code}</div>
                <div className="cg-text-muted" style={{ fontSize: '0.8rem', color: s.online ? 'var(--cg-text-black)' : 'var(--cg-text-white)' }}>
                  {s.online ? (onlineMs ? timeAgo(onlineMs) : 'Online') : 'Offline'}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </section>
  )
}
