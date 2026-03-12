import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Monitor, Zap } from 'lucide-react'
import api from '../api'

export default function Pricing() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    load()
  }, [])

  function load() {
    setLoading(true)
    setError(null)

    api.get('/api/pricing')
      .then(r => setItems(r.data?.data || []))
      .catch(e => setError(e.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }

  function formatMMK(value) {
    if (value == null) return '-'
    return `${Number(value).toLocaleString()}`
  }

  // Define some gradient colors to give each card a unique flair
  const gradients = [
    'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)', // Red-Orange
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', // Blue-Cyan
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', // Green-Mint
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', // Pink-Yellow
  ]

  return (
    <section className="page-container">
      <div className="page-title">
        <div>
          <h2>
            <Zap size={28} color="var(--accent)" style={{ verticalAlign: 'middle', marginRight: '10px' }} />
            PC Pricing
          </h2>
          <div className="muted cg-text-muted">
            Choose the package that fits your play session
          </div>
        </div>
      </div>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <div className="cg-spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      )}

      {error && (
        <div className="alert-error" style={{ textAlign: 'center', padding: '20px' }}>
          {error}
        </div>
      )}

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: clamp(12px, 3vw, 24px);
          margin-top: clamp(16px, 3vw, 30px);
        }

        /* Mobile Adjustments */
        @media (max-width: 600px) {
          .pricing-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }
        }
        .pricing-card {
          background: var(--panel);
          border: 1px solid var(--cg-border-light);
          border-radius: clamp(10px, 2vw, 16px);
          padding: clamp(16px, 3vw, 30px) clamp(12px, 2.5vw, 20px);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .pricing-card:hover {
          border-color: var(--accent);
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .pricing-header-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
        }
        .pricing-name {
          font-size: clamp(1rem, 2.5vw, 1.4rem);
          font-weight: 700;
          color: var(--cg-text-header);
          margin-top: 10px;
          margin-bottom: clamp(10px, 2vw, 20px);
        }
        .pricing-amount {
          font-size: clamp(2rem, 6vw, 3.2rem);
          font-weight: 900;
          color: var(--accent);
          line-height: 1;
          margin-bottom: 5px;
        }
        .pricing-currency {
          font-size: clamp(0.8rem, 1.5vw, 1rem);
          font-weight: 600;
          color: var(--cg-text-muted);
          text-transform: uppercase;
        }
        .pricing-feature {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: rgba(255,255,255,0.03);
          padding: clamp(8px, 2vw, 12px) clamp(12px, 3vw, 20px);
          border-radius: 50px;
          margin-top: clamp(14px, 3vw, 25px);
          font-weight: 600;
          font-size: clamp(0.8rem, 2vw, 1rem);
          color: var(--cg-text-header);
        }
      `}</style>

      {!loading && !error && (
        <motion.div
          className="pricing-grid"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          {items.length === 0 && (
            <div className="cg-text-muted" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
              No pricing packages found.
            </div>
          )}

          {items.map((item, i) => (
            <motion.div
              key={item.id}
              className="pricing-card"
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0, transition: { type: 'spring', bounce: 0.4 } }
              }}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              {/* Top Accent Line */}
              <div
                className="pricing-header-line"
                style={{ background: gradients[i % gradients.length] }}
              />

              <div className="pricing-name">{item.name}</div>

              <div className="pricing-amount">
                {formatMMK(item.price)}
              </div>
              <div className="pricing-currency">MMK</div>

              <div className="pricing-feature">
                <Clock size={18} color="var(--cg-text-muted)" />
                {item.hour} Hour{item.hour > 1 ? 's' : ''} Access
              </div>

            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  )
}
