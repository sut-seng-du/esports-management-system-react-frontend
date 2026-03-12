import React, { useState, useEffect } from 'react';
import Nav from './components/Nav'
import Home from './pages/Home'
import Pricing from './pages/Pricing'
import OnlineSessions from './pages/OnlineSessions'
import Announcements from './pages/Announcements'
import './App.css';

export default function App() {
  const [route, setRoute] = useState('home')

  // Initialize theme from localStorage or default to 'dark'
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')

  console.log('App rendering, current route:', route)

  useEffect(() => {
    console.log('App mounted')
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])
  return (
    <div className="app">
      <Nav route={route} setRoute={setRoute} />
      <main>
        {route === 'home' && <Home />}
        {route === 'pricing' && <Pricing />}
        {route === 'online' && <OnlineSessions />}
        {route === 'announcements' && <Announcements />}
        {/* {route === 'top' && <TopMembers />}
        {route === 'drinks' && <Inventory />}
        {route === 'top-debtors' && <TopDebtors />}
        {route === 'settings' && <Settings theme={theme} setTheme={setTheme} />}
        {route === 'login' && <Login />}
        {route === 'logout' && <Logout />} */}
      </main>
    </div>
  )
}