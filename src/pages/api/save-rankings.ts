import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/core/lib/firebase'
import {
  doc,
  writeBatch,
  arrayRemove,
  arrayUnion,
  getDoc
} from 'firebase/firestore'
import { verifyIdToken } from '@/core/lib/firebaseAdmin'

const hasUserVotedForQuestion = async (
  partyId: string,
  questionId: string,
  userId: string
) => {
  const questionRef = doc(db, 'parties', partyId, 'questions', questionId)
  const questionSnapshot = await getDoc(questionRef)
  const questionData = questionSnapshot.data()
  const rankings = questionData?.rankings || []

  return rankings.find((ranking: any) => ranking.userId === userId)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' })
  }

  const { partyId, rankedParticipantsByQuestions } = req.body

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

    for (const ranking of rankedParticipantsByQuestions) {
      const { questionId, participants } = ranking

      if (!questionId || participants.length === 0) {
        continue
      }

      const questionRef = doc(db, 'parties', partyId, 'questions', questionId)

      const existingVote = await hasUserVotedForQuestion(
        partyId,
        questionId,
        userId
      )

      if (existingVote) {
        batch.update(questionRef, {
          rankings: arrayRemove(existingVote)
        })
      }

      batch.update(questionRef, {
        rankings: arrayUnion({
          userId,
          participants
        })
      })
    }

    await batch.commit()
    res.status(200).json({ message: 'Rankings saved successfully!' })
  } catch (error) {
    console.error('Error saving rankings:', error)
    res.status(500).json({ error: 'Erreur lors de la sauvegarde des rankings' })
  }
}
