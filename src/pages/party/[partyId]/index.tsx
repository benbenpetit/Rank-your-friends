import styles from '@/styles/layouts/PartyId.module.scss'
import MainLayout from '@/components/MainLayout/MainLayout'
import { IParty, IQuestion } from '@/core/types/party'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { db } from '@/core/lib/firebase'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { getReadableDateFromTimestamp } from '@/core/utils/date'
import PartyQuestions from '@/components/PartyQuestions/PartyQuestions'
import { useUserContext } from '@/core/context/UserContext'
import { useRef, useState } from 'react'
import gsap from 'gsap'
import Link from 'next/link'

interface PartyPageProps {
  party: IParty
  questions: IQuestion[]
}

const PartyPage: NextPage<PartyPageProps> = ({ party, questions }) => {
  const { user, parties, isAdmin } = useUserContext()
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

  const updatedParty = parties.find((p) => p.id === party.id)

  return (
    <MainLayout>
      <header className={styles.header}>
        <h1>{party.name}</h1>
        <span>{getReadableDateFromTimestamp(party.date)}</span>
        {(party?.voters?.includes(user?.uid ?? '') ||
          updatedParty?.voters?.includes(user?.uid ?? '')) && (
          <span className={styles.voted}>✅ Votes enregistrés&nbsp;</span>
        )}
        {isAdmin && (
          <Link className={styles.admin} href={`/party/${party.id}/results`}>
            🔒 Voir les résultats
          </Link>
        )}
      </header>
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
  try {
    const partiesRef = collection(db, 'parties')
    const snapshot = await getDocs(partiesRef)

    const paths = snapshot.docs.map((doc) => ({
      params: { partyId: doc.id }
    }))

    return { paths, fallback: 'blocking' }
  } catch (error) {
    console.error('Error fetching Firestore data in getStaticPaths:', error)
    return { paths: [], fallback: false }
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { partyId } = params!

  try {
    const partyRef = doc(db, 'parties', partyId as string)
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
      },
      revalidate: 60
    }
  } catch (error) {
    console.error('Error fetching Firestore data in getStaticProps:', error)
    return { notFound: true }
  }
}

export default PartyPage
