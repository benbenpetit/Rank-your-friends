import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/core/lib/firebase'
import { doc, writeBatch, arrayUnion } from 'firebase/firestore'
import { verifyIdToken } from '@/core/lib/firebaseAdmin'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' })
  }

  const { partyId, rankedParticipantsByQuestions, email } = req.body

  if (!partyId || !rankedParticipantsByQuestions) {
    return res
      .status(400)
      .json({ error: 'partyId et rankedParticipantsByQuestions sont requis' })
  }

  try {
    const token = req.headers.authorization?.split('Bearer ')[1]

    if (!token) {
      return res
        .status(401)
        .json({ error: "Token d'authentification manquant" })
    }

    const decodedToken = await verifyIdToken(token)
    const userId = decodedToken.uid

    const batch = writeBatch(db)

    // Add votes to questions
    for (const ranking of rankedParticipantsByQuestions) {
      const { questionId, participants } = ranking

      if (!questionId || participants.length === 0) {
        continue
      }

      const questionRef = doc(db, 'parties', partyId, 'questions', questionId)

      batch.update(questionRef, {
        rankings: arrayUnion({
          email,
          userId,
          participants
        })
      })
    }

    // Add userId to the voters array of the party
    const partyRef = doc(db, 'parties', partyId)
    batch.update(partyRef, {
      voters: arrayUnion(userId)
    })

    await batch.commit()

    res.status(200).json({ message: 'Rankings and votes saved successfully!' })
  } catch (error) {
    console.error('Error saving rankings:', error)
    res.status(500).json({ error: 'Erreur lors de la sauvegarde des rankings' })
  }
}
