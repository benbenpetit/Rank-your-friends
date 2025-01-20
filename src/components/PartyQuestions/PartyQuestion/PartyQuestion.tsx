import { FC, useState } from 'react'
import styles from './PartyQuestion.module.scss'
import { IQuestion } from '@/core/types/party'
import ParticipantsDraggable from '@/components/PartyQuestions/PartyQuestion/ParticipantsDraggable/ParticipantsDraggable'

interface Props {
  question: IQuestion
  participants: string[]
  validateParticipants: (participants: string[]) => void
}

const PartyQuestion: FC<Props> = ({
  question,
  participants,
  validateParticipants
}) => {
  const [sortedParticipants, setSortedParticipants] = useState(participants)

  return (
    <div className={styles.container}>
      <header>
        <h2>{question.text}</h2>
      </header>
      <ParticipantsDraggable
        participants={sortedParticipants}
        setParticipants={setSortedParticipants}
      />
      <button onClick={() => validateParticipants(sortedParticipants)}>
        <span>Valider</span>
      </button>
    </div>
  )
}

export default PartyQuestion
