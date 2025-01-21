import styles from '@/styles/layouts/PartyId.module.scss'
import MainLayout from '@/components/MainLayout/MainLayout'
import { IParty, IQuestion } from '@/core/types/party'
import IResult from '@/core/types/result'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { db } from '@/core/lib/firebase'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { getReadableDateFromTimestamp } from '@/core/utils/date'
import PartyQuestions from '@/components/PartyQuestions/PartyQuestions'
import { useUserContext } from '@/core/context/UserContext'
import { useRef, useState } from 'react'
import gsap from 'gsap'

interface ResultsPageProps {
  party: IParty
  questions: IQuestion[]
  // results: IResult[]
}

const ResultsPage: NextPage<ResultsPageProps> = ({
  party,
  questions
  // results
}) => {
  const { user } = useUserContext()
  const [isLoading, setIsLoading] = useState(false)
  const validateAnimRef = useRef<HTMLDivElement>(null)
  const validateAnimSpanRef = useRef<HTMLSpanElement>(null)
  const validateAnimBgRef = useRef<HTMLSpanElement>(null)

  const handleValidateAnim = () => {
    if (validateAnimRef.current) {
      gsap.set(validateAnimRef.current, {
        display: 'flex'
      })
      gsap.set(validateAnimBgRef.current, {
        scaleY: 0,
        transformOrigin: 'top'
      })
      gsap.to(validateAnimSpanRef.current, {
        duration: 0.8,
        transform: 'translateY(0)',
        ease: 'power4.inOut',
        delay: 0.8
      })
      gsap.to(validateAnimBgRef.current, {
        duration: 1.15,
        scaleY: 1,
        ease: 'power4.inOut',
        onComplete: () => {
          gsap.to(validateAnimBgRef.current, {
            duration: 1.4,
            transformOrigin: 'bottom',
            scaleY: 0,
            ease: 'power4.inOut',
            delay: 1.5,
            onStart: () => {
              gsap.to(validateAnimSpanRef.current, {
                duration: 0.8,
                transform: 'translateY(150%)',
                ease: 'power4.inOut',
                delay: 0.2
              })
              setIsLoading(false)
            },
            onComplete: () => {
              gsap.set(validateAnimRef.current, {
                display: 'none'
              })
            }
          })
        }
      })
    }
  }

  const handleSetParticipantsRankings = async (
    rankedParticipantsByQuestions: {
      questionId: string
      participants: string[]
    }[]
  ) => {
    if (!user) {
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch('/api/save-rankings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify({
          partyId: party.id,
          rankedParticipantsByQuestions
        })
      })

      const data = await response.json()

      if (response.ok) {
        console.log('Rankings enregistrés ou mis à jour:', data.message)
      } else {
        console.error('Erreur:', data.message)
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du vote:", error)
    } finally {
      handleValidateAnim()
    }
  }

  return (
    <MainLayout>
      <header className={styles.header}>
        <h1>{party.name}</h1>
        <span>{getReadableDateFromTimestamp(party.date)}</span>
      </header>
      {/* {results?.map((result) => (
        <div key={result.participant}>
          {result.participant}: {result.average.toFixed(2)}
        </div>
      ))} */}
      <PartyQuestions
        participants={party?.participants ?? []}
        questions={questions}
        setParticipantsRankings={(rankedParticipantsByQuestions) =>
          handleSetParticipantsRankings(rankedParticipantsByQuestions)
        }
        isLoading={isLoading}
      />
      <div className={styles.validateAnim} ref={validateAnimRef}>
        <h3>
          <span ref={validateAnimSpanRef}>Résultats enregistrés 😲✅</span>
        </h3>
        <span className={styles.background} ref={validateAnimBgRef} />
      </div>
    </MainLayout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/get-parties`)
  const data = await res.json()

  const paths = data.parties.map((party: IParty) => ({
    params: { partyId: party.id }
  }))

  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { partyId } = params!

  const partyRef = doc(db, 'parties', partyId as string)
  const partySnap = await getDoc(partyRef)
  if (!partySnap.exists()) {
    return {
      notFound: true
    }
  }
  const partyData = partySnap.data()

  const questionsRef = collection(db, 'parties', partyId as string, 'questions')
  const questionsSnapshot = await getDocs(questionsRef)
  const questions = questionsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }))

  // const resResults = await fetch(
  //   `${process.env.NEXT_PUBLIC_API_URL}/api/results?partyId=${partyId}`
  // )
  // const dataResults = await resResults.json()

  return {
    props: {
      party: {
        id: partyId,
        name: partyData?.name,
        participants: partyData?.participants || [],
        date: partyData?.date?.toDate().toISOString() || ''
      },
      questions: questions ?? []
      // results: dataResults?.results || []
    },
    revalidate: 60
  }
}

export default ResultsPage
