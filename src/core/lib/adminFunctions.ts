import { admin } from './firebaseAdmin' // import the initialized Firebase Admin SDK

export const setAdminRole = async (uid: string) => {
  try {
    // Set custom claims to mark the user as an admin
    await admin.auth().setCustomUserClaims(uid, { role: 'admin' })
    console.log('Admin role set successfully for user with UID:', uid)
  } catch (error) {
    console.error('Error setting admin role:', error)
  }
}
