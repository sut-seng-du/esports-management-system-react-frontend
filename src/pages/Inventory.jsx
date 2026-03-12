import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Coffee, Package } from 'lucide-react'
import api from '../api'

export default function Inventory(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(()=>{
    load()
  },[])

  function load(){
    setLoading(true); setError(null)
    // fetch only drinks
    api.get('/api/inventories?type=drink&per_page=100')
      .then(r=> setItems(r.data?.data || []))
      .catch(e=> setError(e.message || 'Failed to load'))
      .finally(()=> setLoading(false))
  }

  // Animation variants
  const containerVars = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1, 
      transition: { staggerChildren: 0.08 } 
    }
  }

  const cardVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <section className="page-container">
      <div className="page-title">
        <div>
          <h2>
            <Package size={28} color="var(--accent)" style={{ verticalAlign: 'middle', marginRight: '10px' }} />
            Drinks Inventory
          </h2>
          <div className="muted cg-text-muted">
            Manage your stock and pricing
          </div>
        </div>
        <div style={{ background: 'var(--cg-primary)', color: '#fff', padding: '6px 16px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold' }}>
          {items.length} Items Available
        </div>
      </div>

      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 'clamp(12px, 2vw, 20px)' }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="cg-card animate-pulse" style={{ height: '140px', background: 'var(--cg-border-light)' }} />
          ))}
        </div>
      )}

      {error && (
        <div className="alert-error" style={{ textAlign: 'center', padding: '30px' }}>
          <p>{error}</p>
          <button onClick={load} className="cg-btn cg-btn-primary" style={{ marginTop: '15px' }}>Retry Connection</button>
        </div>
      )}

      {!loading && !error && (
        <motion.div 
          className="inventory-grid"
          variants={containerVars}
          initial="hidden"
          animate="show"
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
            gap: 'clamp(12px, 3vw, 24px)',
            marginTop: '20px'
          }}
        >
          {items.length === 0 && (
            <div className="cg-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
              <Package size={48} color="var(--cg-text-muted)" style={{ margin: '0 auto 15px', opacity: 0.5 }} />
              <h3 className="cg-text-header">No drinks found</h3>
              <p className="cg-text-muted">Your inventory is currently empty for this category.</p>
            </div>
          )}

          {items.map(it => (
            <motion.div 
              key={it.id} 
              variants={cardVars}
              whileHover={{ y: -4, scale: 1.01 }}
              className="cg-card"
              style={{
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 'clamp(14px, 2.5vw, 18px)', // Reduced upper bound from 24px to 18px
                borderTop: '4px solid var(--cg-primary)'
              }}
            >
              {/* Dynamic Fill Background */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '6px',
                  background: 'var(--cg-border-light)',
                  overflow: 'hidden'
                }}
              >
                <div 
                  style={{
                    height: '100%',
                    width: it.qty > 10 ? '100%' : it.qty === 0 ? '10%' : it.qty <= 7 ? '50%' : '75%', // Dynamic width logic
                    background: it.qty > 10 ? '#22c55e' : it.qty === 0 ? '#ef4444' : it.qty <= 7 ? '#eab308' : '#f97316', // Dynamic color logic
                    transition: 'width 0.5s ease-out'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'clamp(12px, 3vw, 20px)', position: 'relative', zIndex: 1, flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ 
                  background: 'rgba(99, 102, 241, 0.1)', 
                  padding: 'clamp(8px, 2vw, 12px)', 
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--cg-primary)'
                }}>
                  {it.type === 'drink' || !it.type ? <Coffee size={24} style={{ width: 'clamp(18px, 4vw, 24px)', height: 'clamp(18px, 4vw, 24px)' }} /> : <Package size={24} style={{ width: 'clamp(18px, 4vw, 24px)', height: 'clamp(18px, 4vw, 24px)' }} />}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <div style={{ 
                    background: it.qty > 10 ? 'rgba(34, 197, 94, 0.1)' : it.qty === 0 ? 'rgba(239, 68, 68, 0.1)' : it.qty <= 7 ? 'rgba(234, 179, 8, 0.1)' : 'rgba(249, 115, 22, 0.1)', 
                    padding: 'clamp(4px, 1.5vw, 6px) clamp(10px, 2.5vw, 14px)', // Made pill padding smaller on mobile
                    borderRadius: '20px',
                    fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)', // Made badge font slightly smaller on mobile
                    fontWeight: 'bold',
                    color: it.qty > 10 ? '#22c55e' : it.qty === 0 ? '#ef4444' : it.qty <= 7 ? '#eab308' : '#f97316',
                    border: `1px solid ${it.qty > 10 ? 'rgba(34, 197, 94, 0.3)' : it.qty === 0 ? 'rgba(239, 68, 68, 0.3)' : it.qty <= 7 ? 'rgba(234, 179, 8, 0.3)' : 'rgba(249, 115, 22, 0.3)'}`
                  }}>
                    {it.qty} Qty
                  </div>
                </div>
              </div>

              <div>
                <h3 className="cg-text-header" style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)', marginBottom: '4px', lineHeight: '1.4' }}>
                  {it.item_name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: 'clamp(0.75rem, 2vw, 0.9rem)', color: 'var(--cg-text-muted)' }}>MMK</span>
                  <span className="cg-text-header" style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.6rem)', fontWeight: 'bold', color: 'var(--accent)' }}>
                    {typeof it.price === 'number' ? it.price.toLocaleString('en-US') : it.price}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  )
}
