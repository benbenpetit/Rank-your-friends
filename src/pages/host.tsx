import styles from '@/styles/layouts/Host.module.scss'
import { db } from '@/core/lib/firebase'
import { verifyIdToken } from '@/core/lib/firebaseAdmin'
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore'
import { GetServerSideProps } from 'next'
import { useRef, useState } from 'react'
import nookies from 'nookies'
import MainLayout from '@/components/MainLayout/MainLayout'
import TextInput from '@/components/TextInput/TextInput'
import ListParticipants from '@/components/ListParticipants/ListParticipants'
import CTA from '@/components/CTA/CTA'
import ListQuestions from '@/components/ListQuestions/ListQuestions'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'

const HostPage = () => {
  const router = useRouter()
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [participantText, setParticipantText] = useState('')
  const [participants, setParticipants] = useState<string[]>([])
  const [questionText, setQuestionText] = useState('')
  const [questions, setQuestions] = useState<string[]>([])
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
              setTimeout(() => {
                router.push('/')
              }, 500)
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

  const createParty = async () => {
    try {
      setIsLoading(true)
      const [day, month, year] = date.split('/').map(Number)
      const cleanDate = new Date(year, month - 1, day)

      const partyRef = doc(collection(db, 'parties'))
      await setDoc(partyRef, {
        name: name,
        participants: participants.sort(),
        createdAt: Timestamp.now(),
        date: Timestamp.fromDate(cleanDate)
      })

      for (const question of questions) {
        const questionRef = doc(collection(partyRef, 'questions'))
        await setDoc(questionRef, {
          text: question
        })
      }
    } catch (error) {
      console.error('Erreur lors de la création de la party :', error)
    } finally {
      handleValidateAnim()
    }
  }

  return (
    <MainLayout>
      <h1 className={styles.title}>Créer une soirée</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <TextInput
          placeholder='Titre'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextInput
          placeholder='Date (jj/mm/aaaa)'
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <TextInput
          placeholder='Participant'
          value={participantText}
          onChange={(e) => setParticipantText(e.target.value)}
          cta={{
            text: 'Ajouter',
            onClick: () => {
              if (participantText && !participants.includes(participantText)) {
                setParticipants([...participants, participantText])
                setParticipantText('')
              }
            }
          }}
        />
        {participants.length !== 0 && (
          <ListParticipants
            participants={participants}
            handleRemoveParticipant={(name) => {
              setParticipants(participants.filter((n) => n !== name))
            }}
          />
        )}
        <TextInput
          placeholder='Question'
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          cta={{
            text: 'Ajouter',
            onClick: () => {
              if (questionText && !questions.includes(questionText)) {
                setQuestions([...questions, questionText])
                setQuestionText('')
              }
            }
          }}
        />
        {questions.length !== 0 && (
          <ListQuestions
            questions={questions}
            handleRemoveQuestion={(name) => {
              setQuestions(questions.filter((n) => n !== name))
            }}
          />
        )}
        <CTA text='Créer' onClick={createParty} isLoading={isLoading} />
        <div className={styles.validateAnim} ref={validateAnimRef}>
          <h3>
            <span ref={validateAnimSpanRef}>Soirée créée 🤑✅</span>
          </h3>
          <span className={styles.background} ref={validateAnimBgRef} />
        </div>
      </div>
    </MainLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = nookies.get(context).token || '' // Get token from cookies
  let isAdmin = false

  if (token) {
    try {
      const decodedToken = await verifyIdToken(token)
      isAdmin = decodedToken.role === 'admin' // Check if the user is an admin
    } catch (error) {
      console.error('Authentication error:', error)
      return { redirect: { destination: '/', permanent: false } } // Redirect non-admins
    }
  }

  if (!isAdmin) {
    return { redirect: { destination: '/', permanent: false } } // Redirect if not admin
  }

  return {
    props: {}
  }
}

export default HostPage
