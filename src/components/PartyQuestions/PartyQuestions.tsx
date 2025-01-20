import { FC, Fragment, ReactNode, useEffect, useMemo, useState } from 'react'
import styles from './PartyQuestions.module.scss'
import { IQuestion } from '@/core/types/party'
import PartyQuestion from '@/components/PartyQuestions/PartyQuestion/PartyQuestion'
import Spinner from '@/components/Spinner/Spinner'

interface Props {
  participants: string[]
  questions: IQuestion[]
  setParticipantsRankings: (
    rankedParticipantsByQuestions: {
      questionId: string
      participants: string[]
    }[]
  ) => void
  isLoading: boolean
}

const PartyQuestions: FC<Props> = ({
  questions,
  participants,
  setParticipantsRankings,
  isLoading
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [hasAnsweredAllQuestions, setHasAnsweredAllQuestions] = useState(false)
  const [sortedParticipants, setSortedParticipants] = useState(
    questions.map((question) => ({
      questionId: question.id,
      participants: participants
    }))
  )

  const getQuestionParticipants = (questionId: string) => {
    return (
      sortedParticipants.find((question) => question.questionId === questionId)
        ?.participants ?? []
    )
  }

  const handleSetQuestionParticipants = (
    participants: string[],
    questionId: string
  ) => {
    setSortedParticipants((prev) =>
      prev.map((question) =>
        question.questionId === questionId
          ? { ...question, participants }
          : question
      )
    )
  }

  const handleValidateParticipants = (
    newParticipants: string[],
    questionId: string
  ) => {
    handleSetQuestionParticipants(newParticipants, questionId)

    setCurrentQuestionIndex((prev) => prev + 1)
    if (currentQuestionIndex === questions.length - 1) {
      setHasAnsweredAllQuestions(true)
    }
  }

  useEffect(() => {
    if (!isLoading) {
      setCurrentQuestionIndex(0)
      setHasAnsweredAllQuestions(false)
    }
  }, [isLoading])

  return (
    <div className={styles.container}>
      <div
        className={styles.swiper}
        style={{ transform: `translateX(-${currentQuestionIndex * 100}%)` }}
      >
        {questions?.map((question) => (
          <div key={question.id} className={styles.slide}>
            <PartyQuestion
              question={question}
              participants={getQuestionParticipants(question.id)}
              validateParticipants={(newParticipants) =>
                handleValidateParticipants(newParticipants, question.id)
              }
            />
          </div>
        ))}
        <div key='validate' className={styles.slide}>
          <button
            className={styles.validateButton}
            onClick={() =>
              hasAnsweredAllQuestions
                ? setParticipantsRankings(sortedParticipants)
                : undefined
            }
          >
            {!isLoading ? <span>Envoyer les votes</span> : <Spinner />}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PartyQuestions
