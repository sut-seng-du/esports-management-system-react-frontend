import React from 'react'
import { motion } from 'framer-motion'
import {
    Zap,
    Cpu,
    Wifi,
    Gamepad2,
    Trophy,
    Coffee,
    Users,
    ChevronRight,
    ShieldCheck,
    Rocket
} from 'lucide-react'

import HERO_BG from '../assets/esports_hero_bg.jpg'
import GEAR_IMAGE from '../assets/gaming_setup_detail.jpg'

export default function Home() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 }
        }
    }

    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
    }

    const featureCards = [
        {
            icon: <Cpu className="cg-text-primary" size={32} />,
            title: "Elite Hardware",
            desc: "Powered by RTX 40-Series GPUs and latest-gen processors for unmatched performance.",
            color: "var(--accent)"
        },
        {
            icon: <Wifi className="cg-text-primary" size={32} />,
            title: "Gigabit Speed",
            desc: "Ultra-low latency fiber connection ensuring a lag-free competitive edge.",
            color: "#06b6d4"
        },
        {
            icon: <Trophy className="cg-text-primary" size={32} />,
            title: "Pro Arenas",
            desc: "Dedicated tournament zones and VIP rooms for the ultimate session.",
            color: "#f59e0b"
        }
    ]

    const stats = [
        { label: "Active Players", value: "2.4k+" },
        { label: "Tournaments", value: "85+" },
        { label: "Pro Rigs", value: "120+" },
        { label: "Win Rate", value: "99.9%" }
    ]

    return (
        <motion.div
            className="page-container"
            initial="hidden"
            animate="show"
            variants={container}
            style={{ overflow: 'hidden' }}
        >
            {/* Hero Section */}
            <motion.div variants={fadeInUp} className="hero-wrapper">
                <div
                    style={{
                        backgroundImage: `url(${HERO_BG})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        height: 'clamp(400px, 60vh, 700px)',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px'
                    }}
                >
                    <div className="hero-image-overlay" />

                    <div
                        className="glass-card-premium"
                        style={{
                            zIndex: 2,
                            padding: 'clamp(30px, 5vw, 60px)',
                            maxWidth: '800px',
                            textAlign: 'center',
                            margin: '0 20px'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                                <span style={{
                                    background: 'rgba(124, 58, 237, 0.2)',
                                    color: 'var(--accent)',
                                    padding: '6px 16px',
                                    borderRadius: '100px',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    border: '1px solid var(--accent)'
                                }}>
                                    <Zap size={14} /> NOW OPEN 24/7
                                </span>
                            </div>
                            <h1 className="cg-text-header" style={{ fontSize: 'clamp(2rem, 7vw, 4.5rem)', margin: '0 0 20px 0', lineHeight: 1.1, fontWeight: 900, letterSpacing: '-2px' }}>
                                Level Up Your <span style={{ color: 'var(--accent)' }}>Game</span>
                            </h1>
                            <p className="cg-text-body" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', opacity: 0.9, marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
                                Experience the next generation of competitive gaming at RightClick. Ultra-high spec rigs, premium comfort, and elite community.
                            </p>
                            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <button
                                    className="cg-btn cg-btn-primary hover-glow"
                                    style={{ width: 'auto', padding: '16px 32px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}
                                >
                                    Book Your RIG <ChevronRight size={20} />
                                </button>
                                <button
                                    className="cg-btn glass-card-premium"
                                    style={{ width: 'auto', padding: '16px 32px', borderRadius: '14px', border: '1px solid var(--cg-border)' }}
                                >
                                    View Tournaments
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Feature Grid */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '24px',
                    marginBottom: '60px'
                }}
            >
                {featureCards.map((card, idx) => (
                    <motion.div
                        key={idx}
                        variants={fadeInUp}
                        className="cg-card hover-glow"
                        style={{ padding: '40px', position: 'relative', overflow: 'hidden' }}
                    >
                        <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.05, transform: 'rotate(-15deg)' }}>
                            {React.cloneElement(card.icon, { size: 120 })}
                        </div>
                        <div style={{ marginBottom: '20px' }}>{card.icon}</div>
                        <h3 className="cg-text-header" style={{ fontSize: '1.5rem', marginBottom: '12px', fontWeight: 800 }}>{card.title}</h3>
                        <p className="cg-text-body" style={{ opacity: 0.8, lineHeight: 1.6 }}>{card.desc}</p>
                    </motion.div>
                ))}
            </div>

            {/* Detail Section */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: '40px',
                    alignItems: 'center',
                    marginBottom: '80px',
                    padding: '20px 0'
                }}
            >
                <motion.div variants={fadeInUp} style={{ flex: '1 1 450px' }}>
                    <h2 className="cg-text-header" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, marginBottom: '24px', lineHeight: 1.1 }}>
                        Engineered for <br /> <span className="cg-text-primary">Victory</span>
                    </h2>
                    <p className="cg-text-body" style={{ fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '32px' }}>
                        We don't just provide PCs; we provide an ecosystem designed for peak performance. From custom-cooled rigs to ergonomic seating and zero-jitter networking, every detail is optimized for your win.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <ShieldCheck className="cg-text-success" />
                            <span className="cg-text-header" style={{ fontWeight: 600 }}>Secure Login</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Rocket className="cg-text-primary" />
                            <span className="cg-text-header" style={{ fontWeight: 600 }}>Fast Launch</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Gamepad2 style={{ color: '#f59e0b' }} />
                            <span className="cg-text-header" style={{ fontWeight: 600 }}>All Top Titles</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Coffee style={{ color: '#ec4899' }} />
                            <span className="cg-text-header" style={{ fontWeight: 600 }}>Full Service</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    variants={fadeInUp}
                    style={{ flex: '1 1 450px', position: 'relative' }}
                    className="animate-float"
                >
                    <div style={{
                        borderRadius: '24px',
                        overflow: 'hidden',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
                        border: '8px solid var(--cg-card-bg)'
                    }}>
                        <img src={GEAR_IMAGE} alt="Gaming Gear" style={{ width: '100%', display: 'block' }} />
                    </div>
                    {/* Accent decoration */}
                    <div style={{
                        position: 'absolute',
                        bottom: '-20px',
                        left: '-20px',
                        width: '100px',
                        height: '100px',
                        background: 'var(--accent)',
                        borderRadius: '20px',
                        zIndex: -1,
                        opacity: 0.3
                    }} />
                </motion.div>
            </div>

            {/* Stats Section */}
            <motion.div
                variants={fadeInUp}
                className="glass-card-premium"
                style={{
                    padding: '40px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '32px',
                    textAlign: 'center'
                }}
            >
                {stats.map((stat, idx) => (
                    <div key={idx}>
                        <div className="cg-text-header" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '4px' }}>{stat.value}</div>
                        <div className="cg-text-muted" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem' }}>{stat.label}</div>
                    </div>
                ))}
            </motion.div>

            {/* Footer / Location */}
            <motion.div
                variants={fadeInUp}
                style={{ marginTop: '80px', textAlign: 'center', paddingBottom: '40px' }}
            >
                <p className="cg-text-muted" style={{ marginBottom: '12px' }}>Located at 123 Gaming Blvd, Downtown • Open 24/7</p>
                <h4 className="cg-text-header" style={{ opacity: 0.6 }}>© 2026 RightClick Esports Center</h4>
            </motion.div>

        </motion.div>
    )
}
