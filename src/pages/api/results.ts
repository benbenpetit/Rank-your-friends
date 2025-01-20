import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/core/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

// Définition du type pour les résultats individuels
interface Result {
  participant: string
  average: number
}

// Handler de l'API
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée.' })
  }

  const { partyId } = req.query

  if (!partyId || typeof partyId !== 'string') {
    return res
      .status(400)
      .json({ message: 'partyId est requis et doit être une chaîne.' })
  }

  try {
    // Requête pour récupérer les votes pour la soirée donnée
    const votesRef = collection(db, 'votes')
    const q = query(votesRef, where('partyId', '==', partyId))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return res
        .status(404)
        .json({ message: 'Aucun vote trouvé pour cette soirée.' })
    }

    // Stockage temporaire des scores par participant
    const scores: { [participant: string]: number[] } = {}

    querySnapshot.forEach((doc) => {
      const { votes } = doc.data()
      for (const [participant, score] of Object.entries(votes)) {
        if (!scores[participant]) {
          scores[participant] = []
        }
        scores[participant].push(score as number)
      }
    })

    // Calcul de la moyenne pour chaque participant
    const results: Result[] = Object.entries(scores).map(
      ([participant, scoresArray]) => ({
        participant,
        average:
          scoresArray.reduce((sum, score) => sum + score, 0) /
          scoresArray.length
      })
    )

    // Tri des résultats par moyenne décroissante (facultatif)
    results.sort((a, b) => b.average - a.average)

    return res.status(200).json({ results })
  } catch (error) {
    console.error('Erreur lors de la récupération des résultats :', error)
    return res.status(500).json({ message: 'Erreur interne du serveur.' })
  }
}

export const fetchVotes = async (partyId: string) => {
  const q = query(collection(db, 'votes'), where('partyId', '==', partyId))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => doc.data())
}

export default handler
