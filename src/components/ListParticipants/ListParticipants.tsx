import { FC } from 'react'
import styles from './ListParticipants.module.scss'

interface Props {
  participants: string[]
  handleRemoveParticipant: (participant: string) => void
}

const ListParticipants: FC<Props> = ({
  participants,
  handleRemoveParticipant
}) => {
  return (
    <div className={styles.container}>
      <ul>
        {participants.map((participant) => (
          <li key={participant}>
            <button onClick={() => handleRemoveParticipant(participant)}>
              <span>{participant}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ListParticipants
