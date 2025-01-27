import { FC } from 'react'
import styles from './PartyCard.module.scss'
import { IParty } from '@/core/types/party'
import { getReadableDateFromTimestamp } from '@/core/utils/date'
import clsx from 'clsx'

interface Props {
  party: IParty
  isVoted?: boolean
}

const PartyCard: FC<Props> = ({ party, isVoted }) => {
  const { name, participants, date } = party

  return (
    <div className={styles.container}>
      <div className={clsx(styles.card, isVoted && styles.isVoted)}>
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
      {isVoted && (
        <div className={styles.voted}>
          <span>✅ Votes enregistrés</span>
        </div>
      )}
    </div>
  )
}

export default PartyCard
