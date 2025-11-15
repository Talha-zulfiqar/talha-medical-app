import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSignupModal } from '../context/SignupModalContext'
import { getCurrentUser, clearCurrentUser } from '../lib/auth'
import Logo from '../assets/logo.svg'
import ImageOptimized from './ImageOptimized'

export default function Header() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { openModal } = useSignupModal()
  const [user, setUser] = useState(null)

  // close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 900) setOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    setUser(getCurrentUser())
    // listen for storage changes (in case of multi-window)
    const onStorage = () => setUser(getCurrentUser())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="brand">
          <div className="logo" aria-hidden>
            {/* Inline SVG logo to ensure it always displays */}
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Free Medical logo">
              <rect width="48" height="48" rx="10" fill="url(#g)"/>
              <path d="M15 29c2.5-3 6-5 9-5s6.5 2 9 5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M24 14v10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#06b6d4"/>
                  <stop offset="1" stopColor="#7c3aed"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="brand-text">
            <strong>Free Medical</strong>
            <span className="tag">Community</span>
          </div>
        </div>

        <nav className={`nav ${open ? 'open' : ''}`} aria-label="Main navigation">
          <Link to="/">Home</Link>
          <Link to="/articles">Articles</Link>
          <Link to="/community">Community</Link>
        </nav>

        <div className="actions">
          {!user ? (
            <button className="btn btn-primary" onClick={() => openModal()}>Get Started</button>
          ) : (
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <span style={{color:'var(--muted)'}}>Hi, {user.name || user.email}</span>
              <button className="btn btn-ghost" onClick={() => { clearCurrentUser(); setUser(null); navigate('/') }}>Logout</button>
            </div>
          )}
        </div>

        <button
          className={`burger ${open ? 'is-open' : ''}`}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        {/* overlay mobile nav */}
        <div className={`mobile-nav ${open ? 'open' : ''}`}>
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/articles" onClick={() => setOpen(false)}>Articles</Link>
          <Link to="/community" onClick={() => setOpen(false)}>Community</Link>
          <div style={{marginTop:16}}>
            <button className="btn btn-primary" onClick={() => { setOpen(false); openModal() }}>Get Started</button>
          </div>
        </div>
      </div>
    </header>
  )
}
