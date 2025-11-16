import React, { useEffect, useRef, useState } from 'react'
import { useLoginModal } from '../context/LoginModalContext'
import { useNavigate } from 'react-router-dom'
import { setAuth } from '../lib/auth'
// using local server auth; Firebase removed to avoid invalid-api-key runtime errors

export default function LoginModal(){
  const { open, closeModal } = useLoginModal()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (open) {
      setTimeout(() => ref.current?.focus(), 50)
      const onKey = (e) => { if (e.key === 'Escape') closeModal() }
      document.addEventListener('keydown', onKey)
      return () => document.removeEventListener('keydown', onKey)
    }
    return undefined
  }, [open, closeModal])

  if (!open) return null

  async function onSubmit(e){
    e.preventDefault()
    setError(null)
    if (!email) return setError('Please provide an email')
    if (!password) return setError('Please provide a password')
    setLoading(true)
    try {
      // Always use server-side login
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email: String(email || '').trim().toLowerCase(), password })
      })
      if (!res.ok) {
        const body = await res.text().catch(() => '')
        throw new Error(`Login failed: ${res.status} ${res.statusText} (url: ${res.url})\n${body}`)
      }
      const data = await res.json()
      setEmail('')
      setPassword('')
      try { setAuth({ token: data.token, user: data.user }) } catch (e) {}
      setTimeout(() => {
        closeModal()
        navigate('/community')
      }, 250)
    } catch (err) {
      setError(err.message || 'Login error')
    } finally { setLoading(false) }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
      <div className="modal" style={{maxWidth:520}}>
        <button className="modal-close" aria-label="Close" onClick={closeModal}>×</button>
        <h3 id="login-modal-title">Log in to Free Medical</h3>
        <p className="lead">Enter your credentials to sign in.</p>
        <form onSubmit={onSubmit}>
          <label style={{display:'block',marginBottom:8}}>Email
            <input ref={ref} type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" required />
          </label>
          <label style={{display:'block',marginBottom:8}}>Password
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input" required />
          </label>
          {error && <div style={{color:'#dc2626',marginBottom:8}}>{error}</div>}
          <div style={{display:'flex',gap:8,marginTop:8}}>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
            <button type="button" className="btn btn-ghost" onClick={closeModal} disabled={loading}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
