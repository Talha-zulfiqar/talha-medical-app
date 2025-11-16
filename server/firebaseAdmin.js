// Lightweight firebase-admin initializer.
// Exports an object: { initialized: boolean, admin: firebaseAdminInstance | null }
// It tries to initialize firebase-admin from either:
// - FIREBASE_SERVICE_ACCOUNT_JSON (raw JSON string), or
// - FIREBASE_SERVICE_ACCOUNT_PATH (path to JSON file)
// If initialization fails or env vars are not set, the module exports { initialized: false, admin: null }.

let initialized = false
let admin = null

try {
  const fbAdmin = require('firebase-admin')
  const saJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  const saPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH

  if (saJson) {
    const parsed = JSON.parse(saJson)
    fbAdmin.initializeApp({ credential: fbAdmin.credential.cert(parsed) })
    initialized = true
    admin = fbAdmin
  } else if (saPath) {
    // require the file (path should point to a JSON file)
    const key = require(saPath)
    fbAdmin.initializeApp({ credential: fbAdmin.credential.cert(key) })
    initialized = true
    admin = fbAdmin
  }
} catch (e) {
  // If firebase-admin isn't installed, env vars are missing, or parsing fails,
  // keep initialized=false and admin=null. This lets the server fall back to local JWTs.
  // console.warn('firebase-admin init skipped:', e && e.message)
}

module.exports = {
  initialized,
  admin
}

JSON.parse(localStorage.getItem('fm_current_user'))

Array.from(document.querySelectorAll('.modal a, .modal button')).map(n => ({text: n.textContent.trim(), html: n.outerHTML}))
