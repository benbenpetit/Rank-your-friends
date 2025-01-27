import styles from '@/styles/layouts/Results.module.scss'
import { verifyIdToken } from '@/core/lib/firebaseAdmin'
import { GetServerSideProps, NextPage } from 'next'
import nookies from 'nookies'
import MainLayout from '@/components/MainLayout/MainLayout'
import { IParty, IQuestion } from '@/core/types/party'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { db } from '@/core/lib/firebase'
import { ParsedUrlQuery } from 'querystring'
import { getReadableDateFromTimestamp } from '@/core/utils/date'
import { getRankingOfQuestion } from '@/core/utils/results'
import RankResult from '@/components/RankResult/RankResult'
import { useState } from 'react'

interface IQuestionWithRanks extends IQuestion {
  rankings: {
    participants: string[]
  }[]
}

interface ResultsPageProps {
  party: IParty
  questions: IQuestionWithRanks[]
}

interface Params extends ParsedUrlQuery {
  partyId: string
}

const ResultsPage: NextPage<ResultsPageProps> = ({ party, questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const handleSlide = (direction: 'left' | 'right') => () => {
    if (direction === 'left') {
      setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
    } else {
      setCurrentQuestionIndex((prev) =>
        Math.min(prev + 1, questions.length - 1)
      )
    }
  }

  return (
    <MainLayout>
      <header className={styles.header}>
        <h1>{party.name}</h1>
        <span>{getReadableDateFromTimestamp(party.date)}</span>
      </header>
      <h1 className={styles.title}>Résultats</h1>
      <div>
        <div className={styles.navButtons}>
          <button onClick={handleSlide('left')}>←&nbsp;&nbsp;Left</button>
          <button onClick={handleSlide('right')}>Right&nbsp;&nbsp;→</button>
        </div>
        <div className={styles.container}>
          <ul
            className={styles.swiper}
            style={{ transform: `translateX(-${currentQuestionIndex * 100}%)` }}
          >
            {questions.map((question) => (
              <li className={styles.slide} key={question.id}>
                <RankResult
                  title={question.text}
                  ranking={getRankingOfQuestion(
                    question.rankings.map((ranking) => ranking.participants)
                  )}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </MainLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = nookies.get(context).token || ''
  let isAdmin = false

  if (token) {
    try {
      const decodedToken = await verifyIdToken(token)
      isAdmin = decodedToken.role === 'admin'
    } catch (error) {
      console.error('Authentication error:', error)
      return { redirect: { destination: '/', permanent: false } }
    }
  }

  if (!isAdmin) {
    return { redirect: { destination: '/', permanent: false } }
  }

  const { partyId } = context.params as Params
  if (!partyId) {
    return { redirect: { destination: '/', permanent: false } }
  }

  try {
    const partyRef = doc(db, 'parties', String(partyId))
    const partySnap = await getDoc(partyRef)

    if (!partySnap.exists()) {
      return { notFound: true }
    }

    const partyData = partySnap.data()

    const questionsRef = collection(
      db,
      'parties',
      partyId as string,
      'questions'
    )
    const questionsSnapshot = await getDocs(questionsRef)
    const questions = questionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

    return {
      props: {
        party: {
          id: partyId,
          name: partyData?.name,
          participants: partyData?.participants || [],
          voters: partyData?.voters || [],
          date: partyData?.date?.toDate().toISOString() || ''
        },
        questions
      }
    }
  } catch (error) {
    console.error('Error fetching party:', error)
    return { redirect: { destination: '/', permanent: false } }
  }
}

export default ResultsPage
