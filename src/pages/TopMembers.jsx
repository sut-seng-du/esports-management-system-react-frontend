import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { User, Medal, Trophy } from 'lucide-react'
import api from '../api'

export default function TopMembers(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(()=>{ load() }, [])

  function load(){
    setLoading(true); setError(null)
    api.get('/api/top-members?limit=10')
      .then(r=> setItems(r.data?.data || []))
      .catch(e=> setError(e.message || 'Failed to load'))
      .finally(()=> setLoading(false))
  }

  return (
    <section className="page-container">
      <div className="page-title">
        <h2>
          <Trophy size={28} color="var(--accent)" style={{ verticalAlign: 'middle', marginRight: '10px' }} />
          Top Members
        </h2>
        <div className="muted cg-text-muted">Top {items.length || 10} by total amount</div>
      </div>
      {/* Loading Skeletons */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="cg-card animate-pulse" style={{ height: '80px', background: 'var(--cg-border-light)' }} />
          ))}
        </div>
      )}

      {error && (
        <div className="alert-error" style={{ textAlign: 'center', padding: '30px' }}>
          <p>{error}</p>
          <button onClick={() => load()} className="cg-btn cg-btn-primary" style={{ marginTop: '15px' }}>Retry Connection</button>
        </div>
      )}

      {/* Leaderboard List */}
      {!loading && !error && (
        <motion.div
          className="top-members-list"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.08 }
            }
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)' }}
        >
          {items.length === 0 && (
            <div className="cg-card" style={{ textAlign: 'center', padding: '40px' }}>
              <User size={48} color="var(--cg-text-muted)" style={{ margin: '0 auto 15px', opacity: 0.5 }} />
              <h3 className="cg-text-header">No members found</h3>
              <p className="cg-text-muted">There are no top members matching right now.</p>
            </div>
          )}

          {items.map((it, idx) => {
            const rank = idx + 1;
            // Rank styling logic
            let rankColor = 'var(--cg-text-muted)';
            let rankBg = 'var(--cg-bg)';
            let IconComponent = User;
            let iconScale = 20;

            if (rank === 1) {
              rankColor = '#eab308'; // Gold
              rankBg = 'rgba(234, 179, 8, 0.1)';
              IconComponent = Medal;
              iconScale = 28;
            } else if (rank === 2) {
              rankColor = '#94a3b8'; // Silver
              rankBg = 'rgba(148, 163, 184, 0.1)';
              IconComponent = Medal;
              iconScale = 24;
            } else if (rank === 3) {
              rankColor = '#d97706'; // Bronze
              rankBg = 'rgba(217, 119, 6, 0.1)';
              IconComponent = Medal;
              iconScale = 24;
            }

            return (
              <motion.div
                key={it.member_ID || idx}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
                }}
                whileHover={{ scale: 1.01, x: 4 }}
                className="cg-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'clamp(10px, 3vw, 16px) clamp(12px, 4vw, 20px)',
                  gap: '10px',
                  borderLeft: rank <= 3 ? `4px solid ${rankColor}` : '4px solid transparent',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Left Side: Rank & ID */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px, 3vw, 16px)' }}>
                  
                  {/* Rank Badge */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 'clamp(36px, 8vw, 48px)',
                    height: 'clamp(36px, 8vw, 48px)',
                    borderRadius: '12px',
                    background: rankBg,
                    color: rankColor,
                    fontWeight: 'bold',
                    fontSize: rank <= 3 ? '0.9rem' : '1rem'
                  }}>
                    {rank <= 3 ? <IconComponent size={iconScale} /> : `#${rank}`}
                  </div>

                  {/* Member Info */}
                  <div>
                    <div style={{ fontSize: 'clamp(0.65rem, 2vw, 0.75rem)', color: 'var(--cg-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px', fontWeight: 'bold' }}>
                      Member ID
                    </div>
                    <div className="cg-text-header" style={{ fontSize: 'clamp(0.95rem, 3vw, 1.2rem)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {rank > 3 && <User size={16} color="var(--cg-primary)" />}
                      {it.member_ID}
                    </div>
                  </div>
                </div>

                {/* Right Side: Total Amount */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 'clamp(0.65rem, 2vw, 0.75rem)', color: 'var(--cg-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px', fontWeight: 'bold' }}>
                    Total Spent
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: 'clamp(0.7rem, 2vw, 0.8rem)', color: 'var(--cg-text-muted)' }}>MMK</span>
                    <span className="cg-text-header" style={{ fontSize: 'clamp(1.1rem, 4vw, 1.5rem)', fontWeight: 'bold', letterSpacing: '-0.5px', color: 'var(--accent)' }}>
                      {Number(it.total_member_amount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </section>
  )
}
