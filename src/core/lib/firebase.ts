import { initializeApp } from 'firebase/app'
import { getAuth, onIdTokenChanged } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import nookies from 'nookies'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

onIdTokenChanged(auth, async (user) => {
  if (user) {
    const token = await user.getIdToken(true) // Force refresh the token
    nookies.set(undefined, 'token', token, { path: '/' }) // Save token in cookies
  } else {
    nookies.destroy(undefined, 'token', { path: '/' }) // Clear cookies if no user
  }
})
