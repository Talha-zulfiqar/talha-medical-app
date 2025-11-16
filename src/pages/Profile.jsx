import React, { useEffect, useState } from 'react'
import { getCurrentUser, getToken, clearCurrentUser, setAuth } from '../lib/auth'
import { useNavigate } from 'react-router-dom'

export default function Profile(){
  const [user, setUser] = useState(getCurrentUser())
  const [bio, setBio] = useState(user?.bio || '')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  async function saveProfile(e){
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const token = getToken()
      const res = await fetch('/api/me', {
        method: 'GET',
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      })
      if (!res.ok) throw new Error('Failed to fetch profile')
      const current = await res.json()

      // update server with patch
      const patchRes = await fetch(`/api/users/${current.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' },
        body: JSON.stringify({ bio })
      })
      if (!patchRes.ok) throw new Error('Failed to update profile')
      const updated = await patchRes.json()
      setUser(updated)
      setAuth({ token, user: updated })
      setMessage('Profile saved')
    } catch (err) {
      setMessage(err.message || 'Could not save profile')
    } finally { setLoading(false) }
  }

  function logout(){
    clearCurrentUser()
    // update UI and redirect to home
    setUser(null)
    navigate('/')
  }

  if (!user) return (
    <div className="container" style={{padding:24}}>
      <h2>Profile</h2>
      <p>Please sign up or log in to view your profile.</p>
    </div>
  )

  return (
    <div className="container" style={{padding:24}}>
      <h2>Your profile</h2>
      <p><strong>{user.name || user.email}</strong></p>
      <div style={{marginBottom:12}}>
        <button className="btn btn-ghost" onClick={logout}>Logout</button>
      </div>
      <form onSubmit={saveProfile} style={{maxWidth:640}}>
        <label style={{display:'block',marginBottom:8}}>Bio
          <textarea value={bio} onChange={e => setBio(e.target.value)} className="input" rows={4} />
        </label>
        <div style={{display:'flex',gap:8}}>
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Saving…' : 'Save'}</button>
        </div>
        {message && <div style={{marginTop:12}}>{message}</div>}
      </form>
    </div>
  )
}
