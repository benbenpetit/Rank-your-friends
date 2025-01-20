import { initializeApp } from 'firebase/app'
import { getAuth, onIdTokenChanged } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import nookies from 'nookies'

const firebaseConfig = {
  apiKey: 'AIzaSyDcjHf1Lithk-Y9asfZp8GZMNR_LyMk9Xs',
  authDomain: 'tierlist-friends.firebaseapp.com',
  projectId: 'tierlist-friends',
  storageBucket: 'tierlist-friends.firebasestorage.app',
  messagingSenderId: '335070166930',
  appId: '1:335070166930:web:05a56242dac09dd7428b4b'
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
