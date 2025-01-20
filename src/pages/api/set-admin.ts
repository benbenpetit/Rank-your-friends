import { NextApiRequest, NextApiResponse } from 'next'
import { setAdminRole } from '@/core/lib/adminFunctions' // The function you wrote to set the admin role

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { uid } = req.body // Assume you're sending the UID in the body of the request

  if (!uid) {
    return res.status(400).json({ error: 'User UID is required' })
  }

  try {
    // Call the setAdminRole function with the UID
    await setAdminRole(uid)
    res.status(200).json({ success: `User ${uid} has been set as admin` })
  } catch (error) {
    res.status(500).json({ error: 'Failed to set admin role' })
  }
}
