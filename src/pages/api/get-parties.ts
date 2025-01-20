import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/core/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { IParty } from '@/core/types/party'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée.' })
  }

  try {
    const partiesRef = collection(db, 'parties')
    const querySnapshot = await getDocs(partiesRef)

    const parties: any[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

    return res.status(200).json({ parties: parties as IParty[] })
  } catch (error) {
    console.error('Erreur lors de la récupération des parties :', error)
    return res.status(500).json({ message: 'Erreur interne du serveur.' })
  }
}

export default handler
