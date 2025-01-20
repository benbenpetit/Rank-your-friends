import { FC } from 'react'
import styles from './PartyCard.module.scss'
import { IParty } from '@/core/types/party'
import { getReadableDateFromTimestamp } from '@/core/utils/date'

interface Props {
  party: IParty
}

const PartyCard: FC<Props> = ({ party }) => {
  const { name, participants, date } = party

  return (
    <div className={styles.container}>
      <header>
        <h2 className={styles.title}>{name}</h2>
        <span className={styles.date}>
          {getReadableDateFromTimestamp(date)}
        </span>
      </header>
      <ul className={styles.participants}>
        {participants.map((participant) => (
          <li className={styles.participant} key={participant}>
            <span>{participant}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PartyCard
