import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, Monitor, Plus, Edit2, Trash2, X, CheckCircle2, AlertCircle } from 'lucide-react'
import api from '../api'

export default function Bookings() {
  const [bookings, setBookings] = useState([])
  const [seats, setSeats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBooking, setEditingBooking] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState(null)

  const [formData, setFormData] = useState({
    seats: [],
    date: new Date().toISOString().split('T')[0],
    start_time: '12:00',
    end_time: '15:00', // Default to 3 hours
  })

  const [occupiedSeatIds, setOccupiedSeatIds] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (formData.date && formData.start_time && formData.end_time) {
      fetchOccupiedSeats()
    }
  }, [formData.date, formData.start_time, formData.end_time])

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [bookingsRes, seatsRes] = await Promise.all([
        api.get('/api/bookings'),
        api.get('/api/seats')
      ])
      setBookings(bookingsRes.data?.data || [])
      setSeats(seatsRes.data?.data || [])
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const fetchOccupiedSeats = async () => {
    try {
      const res = await api.get('/api/bookings/availability', {
        params: {
          date: formData.date,
          start_time: formData.start_time,
          end_time: formData.end_time,
          exclude_booking_id: editingBooking?.id
        }
      })
      setOccupiedSeatIds(res.data.occupied_seat_ids || [])
    } catch (err) {
      console.error('Failed to fetch availability', err)
    }
  }

  const handleOpenModal = (booking = null) => {
    if (booking) {
      setEditingBooking(booking)
      setFormData({
        seats: booking.seats.map(code => seats.find(s => s.code === code)?.id).filter(Boolean),
        date: booking.date,
        start_time: booking.start_time.substring(0, 5),
        end_time: booking.end_time.substring(0, 5),
      })
    } else {
      setEditingBooking(null)
      setFormData({
        seats: [],
        date: new Date().toISOString().split('T')[0],
        start_time: '12:00',
        end_time: '15:00',
      })
    }
    setFormError(null)
    setIsModalOpen(true)
    // fetchOccupiedSeats will be triggered by useEffect
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingBooking(null)
    setOccupiedSeatIds([])
  }

  const handleSeatToggle = (seatId) => {
    if (occupiedSeatIds.includes(seatId)) return // Prevent selecting occupied seats

    setFormData(prev => ({
      ...prev,
      seats: prev.seats.includes(seatId)
        ? prev.seats.filter(id => id !== seatId)
        : [...prev.seats, seatId]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate Duration (3 hours)
    const start = new Date(`${formData.date}T${formData.start_time}`)
    const end = new Date(`${formData.date}T${formData.end_time}`)
    const diffMs = end - start
    const diffHrs = diffMs / (1000 * 60 * 60)

    if (diffHrs < 3) {
      setFormError('Minimum booking duration is 3 hours.')
      return
    }

    if (formData.seats.length === 0) {
      setFormError('Please select at least one seat')
      return
    }

    setFormLoading(true)
    setFormError(null)
    try {
      if (editingBooking) {
        await api.put(`/api/bookings/${editingBooking.id}`, formData)
      } else {
        await api.post('/api/bookings', formData)
      }
      fetchData()
      handleCloseModal()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save booking')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return
    try {
      await api.delete(`/api/bookings/${id}`)
      fetchData()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete booking')
    }
  }

  return (
    <section className="page-container">
      <div className="page-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>
            <Calendar size={28} color="var(--accent)" style={{ verticalAlign: 'middle', marginRight: '10px' }} />
            Bookings
          </h2>
          <div className="muted cg-text-muted">Manage your game station reservations</div>
        </div>
        <button className="cg-btn cg-btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={20} /> New Booking
        </button>
      </div>

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="cg-card animate-pulse" style={{ height: '100px', background: 'var(--cg-border-light)' }} />
          ))}
        </div>
      )}

      {error && (
        <div className="alert-error" style={{ textAlign: 'center', padding: '30px' }}>
          <p>{error}</p>
          <button onClick={fetchData} className="cg-btn cg-btn-primary" style={{ marginTop: '15px' }}>Retry</button>
        </div>
      )}

      <motion.div
        className="bookings-list"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        {!loading && bookings.length === 0 && (
          <div className="cg-card" style={{ textAlign: 'center', padding: '40px' }}>
            <Calendar size={48} color="var(--cg-text-muted)" style={{ margin: '0 auto 15px', opacity: 0.5 }} />
            <h3 className="cg-text-header">No bookings found</h3>
            <p className="cg-text-muted">You haven't made any bookings yet.</p>
          </div>
        )}

        {bookings.map(booking => (
          <motion.div
            key={booking.id}
            variants={{
              hidden: { opacity: 0, y: 10 },
              show: { opacity: 1, y: 0 }
            }}
            className="cg-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '20px',
              gap: '12px',
              borderLeft: booking.confirmed ? '4px solid #22c55e' : '4px solid #eab308'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={18} color="var(--accent)" />
                  <span style={{ fontWeight: 'bold' }}>{booking.date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={18} color="var(--accent)" />
                  <span>{booking.start_time.substring(0, 5)} - {booking.end_time.substring(0, 5)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Monitor size={18} color="var(--accent)" />
                   <span>Seats: {booking.seats.join(', ')}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="cg-btn" style={{ padding: '8px' }} onClick={() => handleOpenModal(booking)}>
                  <Edit2 size={16} />
                </button>
                <button className="cg-btn" style={{ padding: '8px', color: '#ef4444' }} onClick={() => handleDelete(booking.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
              {booking.confirmed ? (
                <><CheckCircle2 size={16} color="#22c55e" /> <span style={{ color: '#22c55e' }}>Confirmed</span></>
              ) : (
                <><AlertCircle size={16} color="#eab308" /> <span style={{ color: '#eab308' }}>Pending Confirmation</span></>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Modal Backdrop and Content */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.8)',
              zIndex: 2000,
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'clamp(10px, 4vw, 24px)',
              boxSizing: 'border-box'
            }}
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="cg-card"
              style={{
                width: '100%',
                maxWidth: '600px',
                maxHeight: 'min(800px, 90vh)',
                overflowY: 'auto',
                padding: 'clamp(20px, 5vw, 32px)',
                position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 className="cg-text-header" style={{ margin: 0, fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }}>
                  {editingBooking ? 'Edit Booking' : 'New Booking'}
                </h3>
                <button 
                  onClick={handleCloseModal} 
                  style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--cg-text-white)', cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                   <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--cg-text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</label>
                    <input
                      type="date"
                      className="cg-input"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--cg-text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Start</label>
                      <input
                        type="time"
                        className="cg-input"
                        value={formData.start_time}
                        onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--cg-text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>End</label>
                      <input
                        type="time"
                        className="cg-input"
                        value={formData.end_time}
                        onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                   <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--cg-text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Select Seats</label>
                   <div style={{ 
                     display: 'grid', 
                     gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(60px, 15vw, 80px), 1fr))', 
                     gap: '8px', 
                     maxHeight: '240px', 
                     overflowY: 'auto', 
                     padding: '12px', 
                     background: 'rgba(0,0,0,0.2)', 
                     borderRadius: '12px',
                     border: '1px solid var(--cg-border-light)'
                   }}>
                      {seats.map(seat => {
                        const isOccupied = occupiedSeatIds.includes(seat.id)
                        const isSelected = formData.seats.includes(seat.id)

                        return (
                          <motion.div
                            key={seat.id}
                            whileTap={!isOccupied ? { scale: 0.95 } : {}}
                            onClick={() => handleSeatToggle(seat.id)}
                            style={{
                              padding: '12px 0',
                              textAlign: 'center',
                              borderRadius: '10px',
                              cursor: isOccupied ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                              background: isOccupied ? '#ef4444' : isSelected ? 'var(--cg-primary)' : 'rgba(255,255,255,0.03)',
                              color: isOccupied || isSelected ? '#fff' : 'var(--cg-text-white)',
                              border: isOccupied ? '1px solid #ef4444' : isSelected ? '1px solid var(--cg-primary)' : '1px solid rgba(255,255,255,0.05)',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              boxShadow: isSelected ? '0 4px 12px rgba(124, 58, 237, 0.3)' : 'none',
                              opacity: isOccupied ? 0.8 : 1
                            }}
                          >
                            {seat.code}
                          </motion.div>
                        )
                      })}
                   </div>
                </div>

                {formError && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ color: '#ef4444', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                  >
                    <AlertCircle size={16} /> {formError}
                  </motion.div>
                )}

                <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                   <button 
                     type="button" 
                     className="cg-btn" 
                     style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'var(--cg-text-white)' }} 
                     onClick={handleCloseModal}
                   >
                      Cancel
                   </button>
                   <button 
                     type="submit" 
                     className="cg-btn cg-btn-primary" 
                     style={{ flex: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} 
                     disabled={formLoading}
                   >
                      {formLoading ? 'Saving...' : (editingBooking ? <><Edit2 size={18} /> Update</> : <><Plus size={18} /> Create</>)}
                   </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .cg-input {
          width: 100%;
          background: var(--cg-bg);
          border: 1px solid var(--cg-border-light);
          color: var(--cg-text-white);
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        .cg-input:focus {
          outline: none;
          border-color: var(--cg-primary);
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}</style>
    </section>
  )
}
