import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingDown, User } from 'lucide-react'
import api from '../api'

export default function TopDebtors() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // filters
  const [limit, setLimit] = useState(10)
  const [date, setDate] = useState('')   // '' | 'today' | 'YYYY-MM-DD'
  const [month, setMonth] = useState('') // '' | 'YYYY-MM'

  useEffect(() => { load() }, []) // initial load

  function buildQuery(override = {}) {
    const params = new URLSearchParams()
    const l = override.limit !== undefined ? override.limit : limit
    const d = override.date !== undefined ? override.date : date
    const m = override.month !== undefined ? override.month : month

    params.set('limit', String(l || 10))
    if (d) params.set('date', d)
    if (m) params.set('month', m)
    return params.toString()
  }

  function load(override = {}) {
    setLoading(true); setError(null)
    const q = buildQuery(override)

    api.get(`/api/top-debtors?${q}`)
      .then(r => setItems(r.data?.data || []))
      .catch(e => setError(e.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }

  function onApply() {
    if (date && month) setMonth('')
    load()
  }

  function onReset() {
    setLimit(10)
    setDate('')
    setMonth('')
    load({ limit: 10, date: '', month: '' })
  }

  return (
    <section className="page-container">
      <div className="page-title">
        <h2>
          <TrendingDown size={28} color="var(--accent)" style={{ verticalAlign: 'middle', marginRight: '10px' }} />
          Top Debtors
        </h2>
        <div className="muted cg-text-muted">
          Showing top {items.length || limit} members with highest debt
        </div>
      </div>

      {/* Filters */}
      <div
        className="toolbar cg-card"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 'clamp(12px, 2vw, 20px)',
          alignItems: 'end',
          padding: 'clamp(16px, 3vw, 24px)',
          marginBottom: 'clamp(16px, 3vw, 30px)',
          borderTop: '4px solid var(--cg-primary)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label className="cg-input-label cg-text-body" style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>
            Result Limit
          </label>
          <input
            type="number"
            min={1}
            max={100}
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="cg-input"
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: 'auto / span 2' }}>
          <label className="cg-input-label cg-text-body" style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>
            Filter by Date
          </label>
          <div
            className="date-row"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr',
              gap: '12px'
            }}
          >
            <select
              value={date === 'today' ? 'today' : ''}
              onChange={(e) => {
                const v = e.target.value
                if (v === 'today') { setDate('today'); setMonth('') }
                else if (date === 'today') setDate('')
              }}
              className="cg-input"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px' }}
            >
              <option value="">Specific Date...</option>
              <option value="today">Today Only</option>
            </select>

            <input
              type="date"
              value={date && date !== 'today' ? date : ''}
              onChange={(e) => { setDate(e.target.value); setMonth('') }}
              disabled={date === 'today'}
              className="cg-input"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                opacity: date === 'today' ? 0.4 : 1,
                cursor: date === 'today' ? 'not-allowed' : 'text'
              }}
            />
          </div>
          <style>{`
            @media (max-width: 600px) {
              .toolbar > div:nth-child(2) { grid-column: auto !important; }
              .date-row { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label className="cg-input-label cg-text-body" style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>
            Or Filter by Month
          </label>
          <input
            type="month"
            value={month}
            onChange={(e) => { setMonth(e.target.value); setDate('') }}
            className="cg-input"
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', height: '100%' }}>
          <button
            className="cg-btn cg-btn-primary"
            onClick={onApply}
            disabled={loading}
            style={{
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.7 : 1,
              padding: '10px',
              height: '42px',
              alignSelf: 'end',
              borderRadius: '8px'
            }}
          >
            {loading ? '...' : 'Apply'}
          </button>
          <button
            className="cg-btn btn-secondary"
            onClick={onReset}
            disabled={loading}
            style={{
              backgroundColor: 'var(--cg-border)',
              color: 'var(--cg-text-body)',
              cursor: loading ? 'wait' : 'pointer',
              padding: '10px',
              height: '42px',
              alignSelf: 'end',
              borderRadius: '8px',
              border: 'none'
            }}
          >
            Reset
          </button>
        </div>
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
          className="top-debtors-list"
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
              <p className="cg-text-muted">There are no debtors matching your current filters.</p>
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
              rankColor = '#ef4444'; // Red
              rankBg = 'rgba(239, 68, 68, 0.1)';
              IconComponent = TrendingDown;
              iconScale = 28;
            } else if (rank === 2) {
              rankColor = '#f97316'; // Orange
              rankBg = 'rgba(249, 115, 22, 0.1)';
              IconComponent = TrendingDown;
              iconScale = 24;
            } else if (rank === 3) {
              rankColor = '#eab308'; // Yellow
              rankBg = 'rgba(234, 179, 8, 0.1)';
              IconComponent = TrendingDown;
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

                {/* Right Side: Debt Amount */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 'clamp(0.65rem, 2vw, 0.75rem)', color: 'var(--cg-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px', fontWeight: 'bold' }}>
                    Total Debt
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: 'clamp(0.7rem, 2vw, 0.8rem)', color: 'var(--cg-text-muted)' }}>MMK</span>
                    <span className="cg-text-danger" style={{ fontSize: 'clamp(1.1rem, 4vw, 1.5rem)', fontWeight: 'bold', letterSpacing: '-0.5px' }}>
                      {Number(it.total_debt).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
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
