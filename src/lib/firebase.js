// Firebase client initialization for the frontend.
// Reads config from Vite env vars (VITE_FIREBASE_*) in `.env` or `.env.local`.
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
}

// Initialize the Firebase app (safe to call multiple times in bundlers)
let app = null
let auth = null
let initialized = false
try {
  // Detect obvious placeholder values (created by the project template) and treat them as "not configured".
  const apiKey = String(firebaseConfig.apiKey || '').trim()
  const isPlaceholder = !apiKey || /your|replace|changeme|example/i.test(apiKey)
  if (isPlaceholder) {
    console.warn('Firebase client disabled: VITE_FIREBASE_API_KEY looks like a placeholder or is missing. To enable Firebase, add a valid web config to .env')
  } else {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    initialized = true
  }
} catch (e) {
  // initialization failed (invalid api key, network issue, etc.) — do not throw to avoid breaking the app
  console.error('Failed to initialize Firebase client:', e && e.message)
}

export { auth, initialized }
export default app
