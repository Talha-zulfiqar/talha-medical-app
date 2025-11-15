const path = require('path')
const fs = require('fs')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data')
try { fs.mkdirSync(dataDir, { recursive: true }) } catch (e) {}

const dbFile = path.join(dataDir, 'db.json')
const adapter = new FileSync(dbFile)
const db = low(adapter)

// Default structure and seed data if empty
db.defaults({
  articles: [
    { id: 1, title: 'Understanding Hypertension', excerpt: 'Quick summary of causes, treatment and prevention.' },
    { id: 2, title: 'Healthy Eating Essentials', excerpt: 'Nutrition basics to support everyday health.' }
  ],
  community: [
    { id: 1, title: 'Welcome to the community', body: 'Share tips, ask questions, and connect.', created_at: new Date().toISOString() }
  ]
  ,
  signups: [
    { id: 1, email: 'hello@example.com', name: '', created_at: new Date().toISOString() }
  ]
}).write()

function nextId(collection) {
  const arr = db.get(collection).value() || []
  if (arr.length === 0) return 1
  return Math.max.apply(null, arr.map(i => i.id || 0)) + 1
}

module.exports = {
  getArticles() {
    return db.get('articles').value()
  },
  getArticle(id) {
    const nid = Number(id)
    return db.get('articles').find({ id: nid }).value()
  },
  getCommunity() {
    // return copy sorted by id desc
    return db.get('community').sortBy('id').reverse().value()
  },
  createCommunity({ title, body }) {
    const item = {
      id: nextId('community'),
      title,
      body,
      created_at: new Date().toISOString()
    }
    db.get('community').push(item).write()
    return item
  }
  ,
  // simple signup store
  getSignups() {
    return db.get('signups').sortBy('id').reverse().value()
  },
  createSignup({ email, name }) {
    const item = {
      id: nextId('signups'),
      email,
      name: name || '',
      created_at: new Date().toISOString()
    }
    db.get('signups').push(item).write()
    return item
  }
}
