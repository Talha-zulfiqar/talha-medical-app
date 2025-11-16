const express = require('express')
const path = require('path')
const fs = require('fs')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// simple request logger for API routes (helps diagnose 500s)
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) console.log(new Date().toISOString(), req.method, req.url)
  next()
})

// use lowdb JSON-backed helpers
const db = require('./db')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

function requireAuth(req, res, next){
  const auth = req.headers.authorization || ''
  const m = auth.match(/^Bearer\s+(.+)$/i)
  if (!m) return res.status(401).json({ error: 'Missing token' })
  const token = m[1]
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = db.getUserById(payload.sub)
    if (!req.user) return res.status(401).json({ error: 'Invalid token user' })
    return next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

// API endpoints
app.get('/api/articles', (req, res) => {
  const rows = db.getArticles()
  res.json(rows)
})

app.get('/api/articles/:id', (req, res) => {
  const id = Number(req.params.id)
  const a = db.getArticle(id)
  if (!a) return res.status(404).json({ error: 'Not found' })
  res.json(a)
})

app.get('/api/community', (req, res) => {
  const rows = db.getCommunity()
  res.json(rows)
})

app.post('/api/community', (req, res) => {
  const { title, body } = req.body
  if (!title || !body) return res.status(400).json({ error: 'Missing title or body' })
  const item = db.createCommunity({ title, body })
  res.status(201).json(item)
})

// Signup endpoint used by the modal (email + optional name)
app.post('/api/signup', (req, res) => {
  const { email, name } = req.body
  if (!email) return res.status(400).json({ error: 'Missing email' })
  const item = db.createSignup({ email, name })
  res.status(201).json(item)
})

// Auth: signup (creates user) — expects { email, name, password }
app.post('/api/auth/signup', async (req, res) => {
  const { email, name, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' })
  const existing = db.findUserByEmail(email)
  if (existing) return res.status(400).json({ error: 'User already exists' })
  const passwordHash = await bcrypt.hash(password, 10)
  const user = db.createUser({ email, name, passwordHash })
  const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' })
  res.status(201).json({ token, user })
})

// Auth: login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' })
  const u = db.findUserByEmail(email)
  if (!u) return res.status(400).json({ error: 'Invalid credentials' })
  const ok = await bcrypt.compare(password, u.passwordHash || '')
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' })
  const { passwordHash: _ph, ...user } = u
  const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' })
  res.json({ token, user })
})

// Get current user profile
app.get('/api/me', requireAuth, (req, res) => {
  const { passwordHash: _ph, ...user } = req.user
  res.json(user)
})

// Update user profile (patch) - protected
app.patch('/api/users/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id)
  // only allow user to update their own profile in this demo
  if (req.user.id !== id) return res.status(403).json({ error: 'Forbidden' })
  const allowed = ['name', 'bio', 'avatar']
  const patch = {}
  for (const k of allowed) if (k in req.body) patch[k] = req.body[k]
  const updated = db.updateUser(id, patch)
  if (!updated) return res.status(404).json({ error: 'Not found' })
  res.json(updated)
})

// Simple health check for diagnostics (robust: never throws)
app.get('/api/health', (req, res) => {
  try {
    // lightweight check: ensure DB is accessible
    let ok = true
    try {
      if (db && typeof db.getArticles === 'function') db.getArticles()
    } catch (e) {
      console.error('Health check DB read failed:', e && e.message)
      ok = false
    }
    return res.status(ok ? 200 : 500).json({ ok })
  } catch (err) {
    console.error('Health route unexpected error:', err)
    return res.status(500).json({ ok: false, error: err.message })
  }
})

// Serve static files from dist when in production mode
const distPath = path.join(__dirname, '..', 'dist')
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(distPath))
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

// Helpful root route for development and basic checks
app.get('/', (req, res) => {
  // If a built frontend exists, serve it. Otherwise return a small HTML help page.
  const indexHtml = path.join(distPath, 'index.html')
  try {
    if (fs.existsSync(indexHtml)) {
      return res.sendFile(indexHtml)
    }
  } catch (e) {
    // ignore
  }

  res.type('html').send(`
    <html>
      <head><meta charset="utf-8"><title>Backend</title></head>
      <body style="font-family:system-ui,Segoe UI,Roboto,Arial;margin:40px">
        <h1>Backend is running</h1>
        <p>This server exposes the demo API endpoints for the landing page.</p>
        <ul>
          <li><a href="/api/articles">/api/articles</a></li>
          <li><a href="/api/community">/api/community</a></li>
        </ul>
        <p>During development the frontend runs on the Vite dev server (open that URL from <code>npm run dev</code>).</p>
      </body>
    </html>
  `)
})

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`)
})

// generic error handler (returns JSON) - shows stack in non-production for debugging
app.use((err, req, res, next) => {
  console.error('Unhandled error in request:', err)
  const status = err.status || 500
  const payload = { error: err.message || 'Internal Server Error' }
  if (process.env.NODE_ENV !== 'production') payload.stack = err.stack
  res.status(status).json(payload)
})
