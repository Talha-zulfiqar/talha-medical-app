import React, { useEffect, useState } from 'react'
import { API_BASE } from '../lib/api'

export default function Community(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE}/api/community`)
      .then(r => r.json())
      .then(data => setItems(data))
      .catch(err => console.error('Failed to load community', err))
      .finally(() => setLoading(false))
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!title.trim() || !body.trim()) {
      setError('Please enter a title and a message.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch(`${API_BASE}/api/community`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), body: body.trim() })
      })
      if (!res.ok) throw new Error(`Server responded ${res.status}`)
      const created = await res.json()
      // optimistic update
      setItems(prev => [created, ...prev])
      setTitle('')
      setBody('')
    } catch (err) {
      console.error('Post failed', err)
      setError('Failed to submit post — try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container" style={{paddingTop:32}}>
      <h1>Community</h1>
      <p className="lead">Join the community forum to ask questions and help others.</p>

      <section className="card" style={{marginBottom:16}}>
        <h3>Create a post</h3>
        <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:8}}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
          <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Your message" rows={4} />
          {error && <div style={{color:'crimson'}}>{error}</div>}
          <div style={{display:'flex',gap:8}}>
            <button className="btn btn-primary" type="submit" disabled={submitting}>{submitting ? 'Posting…' : 'Post'}</button>
            <button type="button" className="btn btn-ghost" onClick={() => { setTitle(''); setBody(''); setError(null) }} disabled={submitting}>Clear</button>
          </div>
        </form>
      </section>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="grid" style={{marginTop:16}}>
          {items.map(i => (
            <div className="card" key={i.id}>
              <h3>{i.title}</h3>
              <p>{i.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
