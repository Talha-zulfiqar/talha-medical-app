import React, { useEffect, useRef, useState } from 'react'
import { useSignupModal } from '../context/SignupModalContext'
import { useNavigate } from 'react-router-dom'
import { setAuth } from '../lib/auth'

export default function SignupModal(){
  const { open, closeModal } = useSignupModal()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const ref = useRef(null)

  // hooks must be called unconditionally and in the same order each render
  const navigate = useNavigate()

  useEffect(() => {
    if (open) {
      // focus first input
      setTimeout(() => ref.current?.focus(), 50)
      const onKey = (e) => { if (e.key === 'Escape') closeModal() }
      document.addEventListener('keydown', onKey)
      return () => document.removeEventListener('keydown', onKey)
    }
    // if modal is closed there's nothing to cleanup here
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
      // quick health check to show better diagnostics
      try {
        const ping = await fetch('/api/health')
        if (!ping.ok) throw new Error(`health check failed: ${ping.status}`)
      } catch (pingErr) {
        setError('Backend unreachable: ' + (pingErr.message || pingErr))
        setLoading(false)
        return
      }

      const tryPost = async (url, payload) => fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })

      let res = await tryPost('/api/auth/signup', { email, name, password })
      const ct = res.headers.get('content-type') || ''
      if (!res.ok && (res.status === 404 || ct.includes('text/html'))) {
        res = await tryPost('http://127.0.0.1:4000/api/auth/signup', { email, name, password })
      }

      if (!res.ok) {
        let body = ''
        try { body = await res.text() } catch (e) {}
        throw new Error(`Server error: ${res.status} ${res.statusText} ${body}`)
      }
  const data = await res.json()
  setEmail('')
  setName('')
  setPassword('')
  // persist token + user
  try { setAuth({ token: data.token, user: data.user }) } catch (e) {}
      // navigate to community and close modal
      setTimeout(() => {
        closeModal()
        navigate('/community')
      }, 300)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally { setLoading(false) }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="signup-modal-title">
      <div className="modal" style={{maxWidth:520}}>
        <button className="modal-close" aria-label="Close" onClick={closeModal}>×</button>
        <h3 id="signup-modal-title">Get started — join Free Medical</h3>
        <p className="lead">Enter your email to get started. You can complete your profile later.</p>
        <form onSubmit={onSubmit}>
          <label style={{display:'block',marginBottom:8}}>Name (optional)
            <input ref={ref} type="text" value={name} onChange={e => setName(e.target.value)} className="input" />
          </label>
          <label style={{display:'block',marginBottom:8}}>Email
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" required />
          </label>
          <label style={{display:'block',marginBottom:8}}>Password
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input" required />
          </label>
          {error && <div style={{color:'#dc2626',marginBottom:8}}>{error}</div>}
          <div className="note">We respect your privacy — we won't share your email. By joining you agree to our Terms and Privacy.</div>
          <div style={{display:'flex',gap:8,marginTop:8}}>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Joining…' : 'Join'}</button>
            <button type="button" className="btn btn-ghost" onClick={closeModal} disabled={loading}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
