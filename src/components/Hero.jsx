import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSignupModal } from '../context/SignupModalContext'
import HeroIllu from '../assets/hero-illustration.svg'
import ImageOptimized from './ImageOptimized'

export default function Hero() {
  const navigate = useNavigate()
  const { openModal } = useSignupModal()
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-content fade-in-up">
          <h1>Free medical resources for everyone</h1>
          <p className="lead">Trusted information, community help, and tools to manage your health.</p>
          <div className="hero-ctas">
            <button type="button" className="btn btn-primary" onClick={() => openModal()}>Get Started</button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/articles')}>Learn More</button>
          </div>
        </div>

        <div className="hero-visual fade-in">
          <div className="device-mock">
            {/* Inline illustration SVG to guarantee it displays */}
            <svg width="420" height="240" viewBox="0 0 420 240" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="hero illustration">
              <rect x="0" y="0" width="420" height="240" rx="14" fill="#ffffff" />
              <rect x="24" y="24" width="180" height="140" rx="12" fill="#f3f4f6" />
              <circle cx="64" cy="64" r="20" fill="#2563eb" />
              <rect x="104" y="48" width="78" height="12" rx="6" fill="#e6eefc" />
              <rect x="24" y="180" width="320" height="12" rx="6" fill="#f1f5f9" />
              <rect x="220" y="40" width="160" height="112" rx="8" fill="#eff6ff" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
