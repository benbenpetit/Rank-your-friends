import admin, { ServiceAccount } from 'firebase-admin'
import serviceAccountKey from '@/core/lib/serviceAccountKey.json' // Directly import JSON

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey as ServiceAccount) // Pass JSON object directly
  })
}

const verifyIdToken = async (token: string) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token)
    return decodedToken
  } catch (error) {
    console.error('Error verifying token:', error)
    throw new Error('Authentication error')
  }
}

export { admin, verifyIdToken }
