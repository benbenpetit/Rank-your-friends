import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/core/lib/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { getAuth } from 'firebase-admin/auth'

const checkAdmin = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] // Bearer token
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    // Verify token
    const decodedToken = await getAuth().verifyIdToken(token)
    const userEmail = decodedToken.email

    // Check if the user is in the `admins` collection
    const adminQuery = query(
      collection(db, 'admins'),
      where('email', '==', userEmail)
    )
    const adminSnapshot = await getDocs(adminQuery)

    if (!adminSnapshot.empty) {
      return res.status(200).json({ isAdmin: true })
    } else {
      return res.status(403).json({ message: 'Access forbidden' })
    }
  } catch (error) {
    console.error('Error verifying admin:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export default checkAdmin
