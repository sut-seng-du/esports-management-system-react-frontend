import React, { useEffect, useState } from 'react'
import {
    Home,
    CreditCard,
    Monitor,
    Megaphone,
    CupSoda,
    Trophy,
    Banknote,
    LogOut,
    LogIn,
    Menu,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react'
import rcProfile from '../assets/rc-profile.png'

export default function Nav({ route, setRoute }) {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [collapsed, setCollapsed] = useState(false)
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false)

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth <= 768)
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [])

    const navigate = (r) => {
        setRoute(r)
        if (isMobile) setMobileOpen(false)
    }

    const menuItems = [
        { key: 'home', label: 'Home', icon: <Home size={20} /> },
        { key: 'pricing', label: 'Pricing', icon: <CreditCard size={20} /> },
        { key: 'online', label: 'Online PCs', icon: <Monitor size={20} /> },
        { key: 'announcements', label: 'Announcements', icon: <Megaphone size={20} /> },
        { key: 'settings', label: 'Settings', icon: <Monitor size={20} /> },
    ]

    const token = localStorage.getItem('token')
    if (token) {
        menuItems.push(
            { key: 'drinks', label: 'Drinks', icon: <CupSoda size={20} /> },
            { key: 'top', label: 'Top Members', icon: <Trophy size={20} /> },
            { key: 'top-debtors', label: 'Top Debtors', icon: <Banknote size={20} /> },
            { key: 'logout', label: 'Logout', icon: <LogOut size={20} /> }
        )
    } else {
        menuItems.push({ key: 'login', label: 'Login', icon: <LogIn size={20} /> })
    }

    return (
        <>
            {/* Mobile Top Bar */}
            {isMobile && (
                <header className="cg-topbar">
                    <div className="cg-logo-wrap">
                        <div className="cg-logo" style={{ background: 'transparent' }}>
                            <img src={rcProfile} alt="RC" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div className="cg-brand-text">Right Click</div>
                    </div>
                    <button
                        className="cg-mobile-menu-btn"
                        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        <Menu size={22} />
                    </button>
                </header>
            )}

            <aside className={`cg-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'open' : ''}`} aria-hidden={isMobile && !mobileOpen}>
                <div className="cg-sidebar-inner">
                    <div className="cg-sidebar-header">
                        <div
                            className="cg-logo-wrap"
                            onClick={() => collapsed && setCollapsed(false)}
                            style={{ cursor: collapsed ? 'pointer' : 'default' }}
                        >
                            <div className="cg-logo" style={{ background: 'transparent' }}>
                                <img src={rcProfile} alt="RC" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            {!collapsed && <div className="cg-brand-text">Right Click</div>}
                        </div>

                        <button
                            className="cg-collapse-btn"
                            aria-label="Collapse sidebar"
                            onClick={() => setCollapsed(true)}
                            style={{ display: collapsed ? 'none' : 'flex' }}
                        >
                            <ChevronLeft size={20} />
                        </button>
                    </div>

                    <nav className="cg-nav">
                        {menuItems.map((m) => (
                            <button
                                key={m.key}
                                className={`cg-nav-item ${route === m.key ? 'active' : ''}`}
                                onClick={() => navigate(m.key)}
                                aria-current={route === m.key ? 'page' : undefined}
                            >
                                <span className="cg-icon">{m.icon}</span>
                                {!collapsed && <span className="cg-label">{m.label}</span>}
                            </button>
                        ))}
                    </nav>
                </div>

            </aside>
            {/* backdrop moved outside sidebar so it sits behind the sidebar but above content */}
            <div className={`cg-backdrop ${mobileOpen ? 'visible' : ''}`} onClick={() => setMobileOpen(false)} />
        </>
    )
}
