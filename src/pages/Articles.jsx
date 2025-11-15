import React, { useEffect, useState } from 'react'
import { API_BASE } from '../lib/api'

export default function Articles(){
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const url = `${API_BASE}/api/articles`
    fetch(url)
      .then(r => r.json())
      .then(data => setArticles(data))
      .catch(err => console.error('Failed to load articles', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="container" style={{paddingTop:32}}>
      <h1>Articles</h1>
      <p className="lead">Browse medical articles and guides curated by professionals.</p>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="grid" style={{marginTop:16}}>
          {articles.map(a => (
            <div className="card" key={a.id}>
              <h3>{a.title}</h3>
              <p>{a.excerpt}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
