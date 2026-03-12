import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, Megaphone, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'
import api from '../api'

function fmtDate(iso) {
  if (!iso) return '-'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
}

// Skeleton Loader
function SkeletonSlide() {
  return (
    <div style={{
      background: 'var(--cg-card-bg)',
      borderRadius: '16px',
      overflow: 'hidden',
      height: 'clamp(320px, 50vh, 460px)',
      animation: 'pulse 1.5s ease-in-out infinite',
    }}>
      <div style={{ height: '60%', background: 'var(--cg-border-light)' }} />
      <div style={{ padding: '20px' }}>
        <div style={{ height: '20px', width: '70%', background: 'var(--cg-border-light)', borderRadius: '6px', marginBottom: '12px' }} />
        <div style={{ height: '14px', width: '90%', background: 'var(--cg-border-light)', borderRadius: '6px', marginBottom: '8px' }} />
        <div style={{ height: '14px', width: '50%', background: 'var(--cg-border-light)', borderRadius: '6px' }} />
      </div>
    </div>
  )
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => { load() }, [])

  function load() {
    setLoading(true)
    setError(null)
    api.get('/api/announcements?per_page=15&page=1')
      .then(r => setAnnouncements(r.data?.data || []))
      .catch(e => setError(e.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }

  const slideStyle = {
    background: 'var(--cg-card-bg)',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: 'var(--cg-card-shadow)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  }

  return (
    <section className="page-container">
      <div className="page-title">
        <div>
          <h2>
            <Megaphone size={28} color="var(--accent)" style={{ verticalAlign: 'middle', marginRight: '10px' }} />
            Announcements
          </h2>
          <div className="muted cg-text-muted">
            {loading ? 'Fetching latest updates...' : `${announcements.length} announcements`}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ marginBottom: '20px', padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--cg-danger)', textAlign: 'center' }}
          >
            {error}
            <button onClick={load} className="cg-btn cg-btn-primary" style={{ marginTop: '10px' }}>Retry</button>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <SkeletonSlide />
        </div>
      ) : announcements.length === 0 && !error ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--cg-text-muted)' }}
        >
          <Megaphone size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.25rem', color: 'var(--cg-text-header)', marginBottom: '8px' }}>No Announcements Yet</h3>
          <p>Check back later for updates and news.</p>
        </motion.div>
      ) : !error && announcements.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Counter Badge */}
          <div style={{ textAlign: 'center', marginBottom: 'clamp(12px, 2vw, 20px)' }}>
            <span style={{
              display: 'inline-block',
              background: 'var(--accent)',
              color: '#fff',
              padding: '6px 18px',
              borderRadius: '20px',
              fontSize: 'clamp(0.75rem, 2vw, 0.9rem)',
              fontWeight: 700,
              letterSpacing: '0.5px',
            }}>
              {activeIndex + 1} / {announcements.length}
            </span>
          </div>

          {/* Swiper Carousel */}
          <div style={{ position: 'relative' }}>
            <Swiper
              modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={'auto'}
              coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 120,
                modifier: 2,
                slideShadows: false,
              }}
              autoplay={{ delay: 5000, disableOnInteraction: true }}
              pagination={{ clickable: true, dynamicBullets: true }}
              navigation={{
                nextEl: '.swiper-btn-next',
                prevEl: '.swiper-btn-prev',
              }}
              onSlideChange={(s) => setActiveIndex(s.activeIndex)}
              spaceBetween={20}
              style={{ paddingBottom: '50px' }}
            >
              {announcements.map((a) => (
                <SwiperSlide key={a.id} style={{ width: 'clamp(280px, 80vw, 600px)' }}>
                  <div style={slideStyle}>
                    {/* Poster Image */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      {a.poster_image ? (
                        <img
                          src={a.poster_image}
                          alt={a.title}
                          style={{
                            width: '100%',
                            height: 'clamp(180px, 30vh, 280px)',
                            objectFit: 'cover',
                            display: 'block',
                          }}
                          loading="lazy"
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: 'clamp(180px, 30vh, 280px)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.15))',
                          color: 'var(--cg-text-muted)',
                          gap: '8px',
                        }}>
                          <ImageIcon size={48} style={{ opacity: 0.4 }} />
                          <span style={{ fontSize: '0.85rem' }}>No Image</span>
                        </div>
                      )}

                      {/* Status Badge */}
                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        background: a.active ? 'rgba(34,197,94,0.9)' : 'rgba(239,68,68,0.9)',
                        color: '#fff',
                        backdropFilter: 'blur(4px)',
                      }}>
                        {a.active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>

                    {/* Content */}
                    <div style={{
                      padding: 'clamp(14px, 3vw, 24px)',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}>
                      <h3 style={{
                        fontSize: 'clamp(1rem, 3vw, 1.3rem)',
                        fontWeight: 800,
                        color: 'var(--cg-text-header)',
                        margin: 0,
                        lineHeight: 1.3,
                      }}>
                        {a.title}
                      </h3>

                      <p style={{
                        fontSize: 'clamp(0.8rem, 2.5vw, 0.95rem)',
                        color: 'var(--cg-text-muted)',
                        lineHeight: 1.6,
                        margin: 0,
                        flex: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {a.description || 'No description provided.'}
                      </p>

                      {/* Date Metadata */}
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '12px',
                        fontSize: 'clamp(0.7rem, 2vw, 0.82rem)',
                        color: 'var(--cg-text-muted)',
                        paddingTop: '10px',
                        borderTop: '1px solid var(--cg-border-light)',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={14} />
                          <span>{fmtDate(a.start_datetime)}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={14} />
                          <span>{fmtDate(a.end_datetime)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Arrows */}
            <button className="swiper-btn-prev" style={{
              position: 'absolute',
              top: '40%',
              left: 'clamp(-5px, -1vw, -15px)',
              zIndex: 10,
              background: 'var(--cg-card-bg)',
              border: '1px solid var(--cg-border)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--cg-text-body)',
              boxShadow: 'var(--cg-card-shadow)',
              transition: 'all 0.2s ease',
            }}>
              <ChevronLeft size={20} />
            </button>
            <button className="swiper-btn-next" style={{
              position: 'absolute',
              top: '40%',
              right: 'clamp(-5px, -1vw, -15px)',
              zIndex: 10,
              background: 'var(--cg-card-bg)',
              border: '1px solid var(--cg-border)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--cg-text-body)',
              boxShadow: 'var(--cg-card-shadow)',
              transition: 'all 0.2s ease',
            }}>
              <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>
      ) : null}

      {/* Swiper Custom Styles */}
      <style>{`
        .swiper-pagination-bullet {
          background: var(--accent) !important;
          opacity: 0.4;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          opacity: 1;
          transform: scale(1.3);
        }
        .swiper-slide {
          transition: transform 0.4s ease, opacity 0.4s ease;
        }
        .swiper-slide-active {
          transform: scale(1);
          opacity: 1;
        }
        .swiper-slide:not(.swiper-slide-active) {
          opacity: 0.5;
        }
        .swiper-btn-prev:hover, .swiper-btn-next:hover {
          background: var(--accent) !important;
          color: #fff !important;
          border-color: var(--accent) !important;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </section>
  )
}
